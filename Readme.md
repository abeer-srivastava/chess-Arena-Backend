# Chess Game Backend

A real-time multiplayer chess game backend built with Node.js, WebSocket, and TypeScript.

## Tech Stack

- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **WebSocket (ws)** - Real-time communication
- **chess.js** - Chess game logic and validation

## Project Structure

```
backend/
├── src/
│   ├── Game.ts          # Game logic and state management
│   ├── GameManager.ts   # Manages multiple game instances
│   ├── index.ts         # Server entry point
│   └── message.ts       # Message type constants
├── dist/                # Compiled JavaScript files
├── node_modules/        # Dependencies
├── package.json         # Project configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The server will start on `ws://localhost:8080` by default.

## WebSocket API

### Message Types

#### Client to Server

**Initialize Game**
```json
{
  "type": "init_game"
}
```

**Make Move**
```json
{
  "type": "move",
  "payload": {
    "from": "e2",
    "to": "e4"
  }
}
```


### File Descriptions

- **`Game.ts`** - Core game logic, move validation, and state management
- **`GameManager.ts`** - Handles player matchmaking and game instance management
- **`index.ts`** - WebSocket server setup and connection handling
- **`message.ts`** - Message type constants for consistent communication



## Frontend Integration

This backend is designed to work with a React/TypeScript chess frontend. The frontend should:

1. Connect to the WebSocket server
2. Send `init_game` message to start matchmaking
3. Handle received board states and update the UI
4. Send move messages in the correct format
5. Handle error messages and game over states

Example frontend connection:
```typescript
const socket = new WebSocket('ws://localhost:8080');
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle different message types
};
```