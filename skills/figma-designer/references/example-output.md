# Example Output

# Login Screen PRD

## Visual Specification

### Layout
- Logo aligned left, icon aligned right
- Form fields stacked with 16px vertical spacing
- Primary button below the form

### Technical Specs

```text
container: {
  width: 100%,
  height: 100%,
  padding: 24px,
  backgroundColor: #FFFFFF,
  justifyContent: center,
}

input: {
  height: 48,
  paddingHorizontal: 16,
  backgroundColor: #F5F5F7,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: transparent,
}

input:focus: {
  borderColor: #007AFF,
}
```

### Generated Code

```typescript
// LoginScreen.tsx
export const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>App Name</Text>
      <Text style={styles.subtitle}>Welcome back</Text>
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};
```

# Platform-Specific Considerations

## React Native

```typescript
const styles = {
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  borderRadius: 12,
};
```

## Web (React)

```css
.button {
  padding: 16px;
  gap: 12px;
  border-radius: 12px;
}
```

## SwiftUI

```swift
.padding(16)
.cornerRadius(12)
```
