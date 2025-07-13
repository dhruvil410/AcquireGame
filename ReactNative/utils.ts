export const getStockPrice = (hotelId: number, chainSize: number): number => {
    const categoryA = [0, 1]; // Luxor & Tower
    const categoryB = [2, 3]; // American & Festival
    const categoryC = [4, 5]; // Imperial & Worldwide
    const categoryD = [6];    // Continental
  
    let basePrice = 0;
  
    if (categoryA.includes(hotelId)) {
      if (chainSize >= 2 && chainSize <= 3) basePrice = 200;
      else if (chainSize >= 4 && chainSize <= 5) basePrice = 300;
      else if (chainSize >= 6 && chainSize <= 10) basePrice = 400;
      else if (chainSize >= 11 && chainSize <= 20) basePrice = 500;
      else if (chainSize >= 21 && chainSize <= 30) basePrice = 600;
      else if (chainSize >= 31 && chainSize <= 40) basePrice = 700;
    } else if (categoryB.includes(hotelId)) {
      if (chainSize >= 2 && chainSize <= 3) basePrice = 300;
      else if (chainSize >= 4 && chainSize <= 5) basePrice = 400;
      else if (chainSize >= 6 && chainSize <= 10) basePrice = 500;
      else if (chainSize >= 11 && chainSize <= 20) basePrice = 600;
      else if (chainSize >= 21 && chainSize <= 30) basePrice = 700;
      else if (chainSize >= 31 && chainSize <= 40) basePrice = 800;
    } else if (categoryC.includes(hotelId)) {
      if (chainSize >= 2 && chainSize <= 3) basePrice = 400;
      else if (chainSize >= 4 && chainSize <= 5) basePrice = 500;
      else if (chainSize >= 6 && chainSize <= 10) basePrice = 600;
      else if (chainSize >= 11 && chainSize <= 20) basePrice = 700;
      else if (chainSize >= 21 && chainSize <= 30) basePrice = 800;
      else if (chainSize >= 31 && chainSize <= 40) basePrice = 900;
    } else if (categoryD.includes(hotelId)) {
      if (chainSize >= 2 && chainSize <= 3) basePrice = 500;
      else if (chainSize >= 4 && chainSize <= 5) basePrice = 600;
      else if (chainSize >= 6 && chainSize <= 10) basePrice = 700;
      else if (chainSize >= 11 && chainSize <= 20) basePrice = 800;
      else if (chainSize >= 21 && chainSize <= 30) basePrice = 900;
      else if (chainSize >= 31 && chainSize <= 40) basePrice = 1000;
    }
  
    return basePrice;
  };