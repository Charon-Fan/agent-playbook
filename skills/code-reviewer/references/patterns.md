# Common Patterns and Anti-Patterns

## Patterns to Encourage

### Error Handling

**Good:**
```typescript
async function getUser(id: string) {
  const user = await db.users.findById(id);
  if (!user) {
    throw new NotFoundError(`User ${id} not found`);
  }
  return user;
}
```

**Bad:**
```typescript
async function getUser(id: string) {
  return await db.users.findById(id); // Returns null, not handled
}
```

### Async/Await

**Good:**
```typescript
const result = await fetch(url);
const data = await result.json();
```

**Bad:**
```typescript
fetch(url).then(r => r.json()).then(data => {
  // Nested callbacks
});
```

### Early Returns

**Good:**
```typescript
function process(user) {
  if (!user) return null;
  if (!user.active) return null;
  return user.data;
}
```

**Bad:**
```typescript
function process(user) {
  if (user) {
    if (user.active) {
      return user.data;
    }
  }
  return null;
}
```

### Destructuring

**Good:**
```typescript
const { name, email } = user;
```

**Bad:**
```typescript
const name = user.name;
const email = user.email;
```

## Anti-Patterns to Catch

### Magic Numbers

**Bad:**
```typescript
if (user.role === 5) { ... }
```

**Good:**
```typescript
const Role = { ADMIN: 5, USER: 1 };
if (user.role === Role.ADMIN) { ... }
```

### Neglected Promise Rejection

**Bad:**
```typescript
fetch(url).then(data => processData(data));
```

**Good:**
```typescript
fetch(url)
  .then(data => processData(data))
  .catch(error => logError(error));
```

### Any Type

**Bad:**
```typescript
function parse(data: any) { ... }
```

**Good:**
```typescript
function parse(data: unknown): Result { ... }
```

### Deep Nesting

**Bad:**
```typescript
if (a) {
  if (b) {
    if (c) {
      doSomething();
    }
  }
}
```

**Good:**
```typescript
if (!a) return;
if (!b) return;
if (!c) return;
doSomething();
```

### Large Functions

**Bad:** Functions > 50 lines

**Good:** Split into smaller, focused functions

### God Objects

**Bad:** Classes/methods that do everything

**Good:** Single Responsibility Principle

### Shotgun Surgery

**Bad:** Adding a feature requires changing many files

**Good:** Good separation of concerns

## React Specific

### Hooks Dependencies

**Bad:**
```typescript
useEffect(() => {
  fetchData(userId);
}, []); // Missing userId dependency
```

**Good:**
```typescript
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### State Updates

**Bad:**
```typescript
setCount(count + 1);
setCount(count + 1);
```

**Good:**
```typescript
setCount(c => c + 2);
```

### Key Props

**Bad:**
```typescript
items.map((item, i) => <Item key={i} />)
```

**Good:**
```typescript
items.map(item => <Item key={item.id} />)
```

## Backend Specific

### N+1 Query

**Bad:**
```python
for user in users:
  posts = db.query("SELECT * FROM posts WHERE user_id = ?", user.id)
```

**Good:**
```python
user_ids = [u.id for u in users]
posts = db.query("SELECT * FROM posts WHERE user_id IN ?", user_ids)
```

### Transaction Handling

**Bad:**
```python
db.transfer(a, b, amount)  # No transaction
```

**Good:**
```python
with db.transaction():
  db.transfer(a, b, amount)
```
