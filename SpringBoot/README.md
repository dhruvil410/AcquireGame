# Acquire Game
This project implements a services for executing Acquire game command operations.

### Running the Service
1. Clone the repository.
2. Navigate to the 'AcquireGame' directory.
3. Build the project using Gradle. It will generate jar file.
   ```bash
    gradle build
   ```
4. Navigate to the directory containing the JAR file.
5. Run the following command:
   ```bash
   java -jar project05-0.0.1-SNAPSHOT.jar
   ```
6. The service will be up

### Testing Service Endpoints
1. Use tools like Postman or command-line tools to send requests to the service endpoints.
2. The service endpoints are accessible at `http://localhost:5432/{}`, where `{}` can be replaced with the desired endpoint (e.g., `setup`, `place`, `buy`, `done`).
3. Refer to the below documentation for sample requests and their formats.
4. Sample requests can be found in the test files located under `AcquireGame/src/test/java/com/oosd/project05/state-tests/`.


### Documentation:

#### Requests:
setup = ``` { "request" : "setup", "players" : [NN, ...] } ``` At least 1, at most 6 players\
place = ```{ "request" : "place", "row" : Row, "column" : Column , "state" : State }``` |\
         ```{ "request" : "place", "row" : Row, "column" : Column , "hotel" : Label, "state" : State }```\
buy   = ```{ "request" : "buy", "shares" : [Label, ...],  "state" : State }``` At least 1, at most 3 shares\
done  = ```{ "request" : "done", "state" : State }```

#### Responses:
State = ```{ "board" : Board, "players" : [Player, ...]```\
Error = ```{ "error" : String }```

#### Common Data:

Player = ```{ "player" : String, "cash" : Cash, shares : [Share, ...], "tiles" : [Tile, ...] }```\
Board  = ```{ "tiles" : [Tile, ...], "hotels" : [Hotel, ...] }```\
Hotel  = ```{ "hotel" : Label, tiles : [Tile, ...]}``` \
Tile   = ```{ "row" : Row, "column" : Column }```\
Share  = ```{ "share" : Label, "count" : Nat }```\
Label  = "American" | ... | "Worldwide"\
Row    = "A" | ... | "I"\
Column = "1" | ... | "12"\
Cash   = Number, interpretable as a natural number (non-negative integer)\
Nat    = Number, interpretable as a natural number less than 26\
NN     = String, 20 chars or fewer

- The response to a request is the state of the game that results from the execution of the required action on the specified state:
  - setup requests a brand new game state, which means an allocating of tiles to the named players; 
  - place requests the placement of the specified tile on behalf of the current player and, if necessary, an action (founding, acquisition) on a specified hotel; 
  - buy requests the acquisition of shares on behalf of the current player; 
  - done requests the allocation of a replacement tile to the current player, if possible, and a switch to the next player in line.

