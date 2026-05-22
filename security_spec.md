# Firestore Security Specification - Community Board

## 1. Data Invariants
- A post must have a title (max 200 chars) and content (max 10,000 chars).
- The `authorId` must match the authenticated user's UID.
- `createdAt` and `updatedAt` must be valid server timestamps.
- Posts are public for reading (list/get).
- Only authenticated users can create posts.
- Only the author can update or delete their posts.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)
1. **Identity Spoofing**: Creating a post with a different `authorId`.
2. **Anonymous Write**: Attempting to create a post without being logged in.
3. **Shadow Update**: Updating a post they don't own.
4. **Timestamp Hijacking**: Providing a client-side timestamp instead of `request.time`.
5. **Resource Poisoning (ID)**: Using a 1MB string as a document ID.
6. **Resource Poisoning (Title)**: Using a 1MB string as a title.
7. **Resource Poisoning (Content)**: Using a 1MB string as content.
8. **Malicious Update**: Changing `authorId` during an update.
9. **Malicious Update**: Changing `createdAt` during an update.
10. **Shadow Field Injection**: Adding a field like `isVerified: true` during update.
11. **PII Leak Attempt**: Unauthorized access to private user data (though not stored in this collection).
12. **Recursive Cost Attack**: Attempting complex queries that bypass rule order.

## 3. Test Runner (Draft)
A `firestore.rules.test.ts` would verify these scenarios using the Firebase Emulator.
- `assertFails(setDoc(postDoc, { authorId: 'someone_else' }))` -> Denied.
- `assertFails(updateDoc(postDoc, { isVerified: true }))` -> Denied.
- `assertFails(updateDoc(postDoc, { createdAt: now }))` -> Denied.
