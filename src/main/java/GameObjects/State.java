package GameObjects;

import java.util.List;

public class State {
    private Board board;
    private List<Player> players;

    public State(Board board, List<Player> players) {
        this.board = board;
        this.players = players;
    }

    // Getters and setters
    public Board getBoard() {
        return board;
    }

    public void setBoard(Board board) {
        this.board = board;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }
}
