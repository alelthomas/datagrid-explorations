import axios from 'axios';

interface Holiday {
  date: string;
  name: string;
  country: string;
}

export async function getHolidays(year: number, country: string): Promise<Holiday[]> {
  try {
    const response = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
    return response.data.map((holiday: any) => ({
      date: holiday.date,
      name: holiday.name,
      country: holiday.countryCode
    }));
  } catch (error) {
    console.error(`Error fetching holidays for ${country}:`, error);
    return [];
  }
}

export async function getHolidaysForCountries(year: number, countries: string[]): Promise<{ [key: string]: { [key: string]: string } }> {
  const holidays: { [key: string]: { [key: string]: string } } = {};
  
  await Promise.all(
    countries.map(async (country) => {
      const countryHolidays = await getHolidays(year, country);
      holidays[country] = {};
      countryHolidays.forEach(holiday => {
        holidays[country][holiday.date] = holiday.name;
      });
    })
  );

  return holidays;
} 