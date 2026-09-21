## Getting Started

run the development server by folloing step:

### Step-1: clone the project from github: 

```
git clone 
```
### Step-2 Navigate to project folder and open in code editor or terminal, run the given command
```
npm install
```
### Step-3: Run the below command to run the app in locally

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Completed Features

- [x] Drag-and-drop canvas with `@dnd-kit/react` reordering and nested dropping (Not stable yet, there's lot of space to improve and fix issues)
- [x] Flexbox/Grid layout settings
- [x] Action toolbar for quick action like duplicate, delete, move element
- [x] Core elements: Text, Container, Button, Image,
- [x] Tab add and remove
- [x] Undo and Redo with Zustand and it's zundo middleware
- [x] Save templates to local storage via Zustand `persist`
- [x] Template manager drawer to load saved templates
- [x] Auto-load latest saved template on page reload or reopen

---

## Remaining Features

- [ ] Table element (rows, columns, cell editing, borders)
- [ ] Shape element
- [ ] Quick components
- [ ] Page management
- [ ] Save document to PDF / Print stylesheet
- [ ] Preview feature
