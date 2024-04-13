import "./index.css";
import "../app/globals.css";


import Header from "../components/Header.jsx";
import Chart from "../components/Chart.jsx";
import errorHandler from "../components/errorHandler";


export default function Index({ data }) {
  if (data.queryValid === false) {
    return (
      <div>
        <h1>Invalid Query</h1>
        <p>{data.message}</p>
      </div>
    );
  }
  return (
    <>
      <section style={{ backgroundImage:  "url('../images/background.png')" }} className='w-full min-h-screen bg-cover bg-center'>
      <div className='w-full h-full py-[1rem] mx-auto'>

      <Header data={data.current} dividends={data.dividends} />
      {/* <Chart data={data.historical}/> */}
      <div className='w-full px-[0px] h-[400px] '>
          <Chart data={data.historical }/>
        </div>
      </div>
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  let symbol = context.query.symbol ?? "AAPL";
  let decimals = context.query.decimals ?? 2;
  let interval = context.query.interval ?? "1day";
  let outputsize = context.query.outputsize ?? "150"; // 6months
  const apiKey = process.env.DATA_API_KEY

 const [currentData, historicalData, dividendsData, logoData] = await Promise.all([
  fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&dp=${decimals}&apikey=${apiKey}&source=docs`),
  fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&dp=${decimals}&apikey=${apiKey}&outputsize=${outputsize}&source=docs`),
  fetch(`https://api.twelvedata.com/dividends?symbol=${symbol}&apikey=${apiKey}`),
]);

const [current, historical, dividends, logo] = await Promise.all([
  currentData.json(),
  historicalData.json(),
  dividendsData.json(),
]);

// Error handling
const currentError = "code" in current;
const historicalError = "code" in historical;
const dividendsError = "code" in dividends;

if (currentError || historicalError || dividendsError) {
  let errorMessage = "An unknown error occurred."; // Default error message
  if (currentError && current && current.message) {
    errorMessage = current.message;
  } else if (historicalError && historical && historical.message) {
    errorMessage = historical.message;
  } else if (dividendsError && dividends && dividends.message) {
    errorMessage = dividends.message;
  }

  return {
    props: {
      data: {
        queryValid: false,
        message: errorMessage,
      },
    },
  };
}


return {
  props: {
    data: {
      current: current,
      historical: historical.values.reverse(),
      dividends: dividends,
      queryValid: true,
    },
  },
};
}