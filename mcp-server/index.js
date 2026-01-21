#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = path.join(__dirname, '../skills');

// Create MCP server
const server = new Server(
  {
    name: 'agent-playbook-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tool: List all skills
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_skills',
      description: 'List all available Claude Code skills in agent-playbook',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Filter by category (meta, core, docs, architecture, planning)',
            enum: ['meta', 'core', 'docs', 'architecture', 'planning']
          }
        }
      }
    },
    {
      name: 'get_skill',
      description: 'Get the content of a specific skill including its description and usage',
      inputSchema: {
        type: 'object',
        properties: {
          skill_name: {
            type: 'string',
            description: 'Name of the skill (e.g., prd-planner, debugger, code-reviewer)'
          },
          include_content: {
            type: 'boolean',
            description: 'Whether to include the full skill file content',
            default: false
          }
        },
        required: ['skill_name']
      }
    },
    {
      name: 'search_skills',
      description: 'Search for skills by keyword in name or description',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query to find matching skills'
          }
        },
        required: ['query']
      }
    },
    {
      name: 'get_skill_hooks',
      description: 'Get the auto-trigger hooks for a skill (what happens after it completes)',
      inputSchema: {
        type: 'object',
        properties: {
          skill_name: {
            type: 'string',
            description: 'Name of the skill'
          }
        },
        required: ['skill_name']
      }
    }
  ]
}));

// Tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'list_skills': {
      const skills = await listSkills(args?.category);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(skills, null, 2)
          }
        ]
      };
    }

    case 'get_skill': {
      const skill = await getSkill(args.skill_name, args?.include_content);
      return {
        content: [
          {
            type: 'text',
            text: skill
          }
        ]
      };
    }

    case 'search_skills': {
      const results = await searchSkills(args.query);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2)
          }
        ]
      };
    }

    case 'get_skill_hooks': {
      const hooks = await getSkillHooks(args.skill_name);
      return {
        content: [
          {
            type: 'text',
            text: hooks
          }
        ]
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Helper functions
async function listSkills(category) {
  const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  const skills = [];

  const categoryMap = {
    meta: ['skill-router', 'create-pr', 'session-logger', 'workflow-orchestrator', 'self-improving-agent', 'auto-trigger'],
    core: ['commit-helper', 'code-reviewer', 'debugger', 'refactoring-specialist'],
    docs: ['documentation-engineer', 'api-documenter', 'test-automator', 'qa-expert'],
    architecture: ['api-designer', 'security-auditor', 'performance-engineer', 'deployment-engineer'],
    planning: ['prd-planner', 'prd-implementation-precheck', 'architecting-solutions', 'planning-with-files', 'self-improving-prd']
  };

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillDir = path.join(SKILLS_DIR, entry.name);
    const skillFile = path.join(skillDir, 'SKILL.md');

    try {
      const content = await fs.readFile(skillFile, 'utf-8');
      const frontMatter = extractFrontMatter(content);

      if (frontMatter) {
        const skillName = entry.name;
        const skillCategory = getSkillCategory(skillName, categoryMap);

        if (!category || skillCategory === category) {
          skills.push({
            name: frontMatter.name || skillName,
            description: frontMatter.description || '',
            category: skillCategory,
            path: skillFile,
            allowed_tools: frontMatter.allowed_tools || []
          });
        }
      }
    } catch (err) {
      // Skip skills without SKILL.md (like single-file skills)
      const singleFile = path.join(SKILLS_DIR, `${entry.name}.md`);
      try {
        const content = await fs.readFile(singleFile, 'utf-8');
        const frontMatter = extractFrontMatter(content);
        if (frontMatter) {
          const skillName = entry.name;
          const skillCategory = getSkillCategory(skillName, categoryMap);
          if (!category || skillCategory === category) {
            skills.push({
              name: frontMatter.name || skillName,
              description: frontMatter.description || '',
              category: skillCategory,
              path: singleFile,
              allowed_tools: frontMatter.allowed_tools || []
            });
          }
        }
      } catch (e) {
        // Skip
      }
    }
  }

  return skills;
}

async function getSkill(skillName, includeContent = false) {
  const possiblePaths = [
    path.join(SKILLS_DIR, skillName, 'SKILL.md'),
    path.join(SKILLS_DIR, `${skillName}.md`)
  ];

  for (const skillPath of possiblePaths) {
    try {
      const content = await fs.readFile(skillPath, 'utf-8');
      const frontMatter = extractFrontMatter(content);

      if (frontMatter) {
        const result = {
          name: frontMatter.name || skillName,
          description: frontMatter.description || '',
          allowed_tools: frontMatter.allowed_tools || [],
          hooks: frontMatter.hooks || {}
        };

        if (includeContent) {
          result.full_content = content;
          result.main_content = content.split('---')[2] || '';
        }

        return JSON.stringify(result, null, 2);
      }
    } catch (err) {
      // Continue to next path
    }
  }

  return JSON.stringify({ error: `Skill '${skillName}' not found` }, null, 2);
}

async function searchSkills(query) {
  const allSkills = await listSkills();
  const lowerQuery = query.toLowerCase();

  const results = allSkills.filter(skill => {
    return skill.name.toLowerCase().includes(lowerQuery) ||
           skill.description.toLowerCase().includes(lowerQuery) ||
           skill.category.toLowerCase().includes(lowerQuery);
  });

  return results;
}

async function getSkillHooks(skillName) {
  const skillData = await getSkill(skillName, true);
  const parsed = JSON.parse(skillData);

  if (parsed.error) {
    return JSON.stringify({ error: parsed.error }, null, 2);
  }

  if (parsed.hooks && parsed.hooks.after_complete) {
    return JSON.stringify({
      skill: parsed.name,
      triggers: parsed.hooks.after_complete
    }, null, 2);
  }

  return JSON.stringify({
    skill: parsed.name,
    hooks: null,
    message: 'This skill has no auto-trigger hooks defined'
  }, null, 2);
}

function extractFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontMatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const keyMatch = line.match(/^(\w+):\s*(.+)$/);
    if (keyMatch) {
      let value = keyMatch[2].trim();

      // Handle array values
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim());
      }

      frontMatter[keyMatch[1]] = value;
    }
  }

  return frontMatter;
}

function getSkillCategory(skillName, categoryMap) {
  for (const [category, skills] of Object.entries(categoryMap)) {
    if (skills.includes(skillName)) {
      return category;
    }
  }
  return 'other';
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Agent Playbook MCP Server running on stdio');
}

main().catch(console.error);
