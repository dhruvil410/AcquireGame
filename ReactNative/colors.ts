// colors.ts
export const colors = {
    // background: '#1A237E',     // Dark blue
    background: '#000000',  //black background
    // tileEmpty: '#BBDEFB',      // Light blue
    tileOccupied: '#FFC107',   // Gold
    // tileBackground: '#FFC107', //Gold dolor
    tileBorder: '#0D47A1',     // Darker blue
    text: '#FFFFFF',           // White
    textSecondary: '#B0BEC5',  // Light grey
    accent: '#FFC107',         // Gold accent 
    
    hotelColors: {
      "-2": 'transparent',        // Unoccupied (transparent)
      "-1": '#BBDEFB',            // Occupied (light blue)
      0: '#FFD700',               // Luxor (gold)
      1: '#800080',               // Tower (purple)
      2: '#FF0000',               // American (red)
      3: '#008000',               // Festival (green)
      4: '#0000FF',               // Imperial (blue)
      5: '#FFA500',               // Worldwide (orange)
      6: '#A52A2A'                // Continental (brown)
  }
  } as const;
  