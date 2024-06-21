package GameObjects;

import java.util.ArrayList;
import java.util.List;

public class Hotel {
    private String label;
    private List<Tile> tiles;
    private int stocksCertificates = 25;

    public Hotel(String label) {
        this.label = label;
        this.tiles = new ArrayList<>();
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public List<Tile> getTiles() {
        return tiles;
    }

    public void setTiles(List<Tile> tiles) {
        this.tiles = tiles;
    }

    public int getStocksCertificates() {
        return stocksCertificates;
    }
    public void setStocksCertificates(int stocksCertificates) {
         this.stocksCertificates = stocksCertificates;
    }

}
