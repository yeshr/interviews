let month = 1;

while(month <= 12) {
  let day = 1,
      tempCodeStr = '';

  if (month <= 9) {
    tempCodeStr = '0';
  }
  tempCodeStr += month;

  while(day <= 31) {
    let passCode = {};

    if (day <= 9) {
      tempCodeStr += '0';
    }
    tempCodeStr += day;

    for(let c of tempCodeStr) {
      passCode[c] = c;
    }

    if (Object.keys(passCode).length === 4) {
      console.log(tempCodeStr);
    }

    tempCodeStr = tempCodeStr.slice(0, 2);
    day++;
  }
  month++;
}
