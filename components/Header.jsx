import React, { useEffect, useState } from 'react';

import "./Header.css";
import "../public/fonts.css";
import Image from 'next/image'

import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { formatDistanceToNow, parseISO  } from 'date-fns';


export default function Header({ data, dividends }) {

  const [dividendYield, setDividendYield] = useState('N/A');


  useEffect(() => {
    const calculateDividendYield = () => {
      if (!dividends || !dividends.dividends || dividends.dividends.length === 0 || !data.close) {
        return "N/A";
      }
      const annualDividends = dividends.dividends[0].amount * 4;
      const dividendYield = (annualDividends / data.close) * 100;
      return dividendYield.toFixed(2) + '%';
    };

    setDividendYield(calculateDividendYield());
  }, [data, dividends]); 


console.log(data.timestamp);

  if (data) {
    return (
      <>
        <div className='px-[5em] pt-[2em] pb-[2em] flex items-center justify-between w-full'>
        {/* ---- left */}
        <div>
          <div className='text-white'>
            <div className='font-bold font-Lexend text-[2.5em]'>{data.symbol}</div>
            <div className='relative'><h1 className='text-white font-Lexend font-light leading-[9rem] text-[10em] p-0'>
              ${data.close}<span className="text-white text-sm absolute bottom-0 ml-5 last-update">
                {data.dateime}
              As of {convertDate(data.timestamp)}
              <br /> {convertTime(data.timestamp)} EDT {data.is_market_open ? '(Market Open)' : '(Market Closed)'}
            </span>
            </h1></div>
            <div className='flex my-3 font-Lexend bg-white px-3 tracking-wide font-bold py-1 rounded-full gap-1 text-blue-950 w-fit'>
              {priceChange(data)}
            </div>

            <div className='mt-5 my-6 flex items-center flex-wrap gap-12'>
              <div className=''>
                <p className='font-bold text-[18px] text-[#277b76] font-Lexend'>OPEN</p>
                <h4 className=' text-[22px] xsm:text-[25px] md:text-[34px] leading-[25px]'>${data.open}</h4>
              </div>
              <div className=''>
                <p className='font-bold text-[18px] text-[#277b76] font-Lexend'>HIGH</p>
                <h4 className=' text-[22px] xsm:text-[25px] md:text-[34px] leading-[25px]'>${data.high}</h4>
              </div>
              <div className=''>
                <p className='font-bold text-[18px] text-[#277b76] font-Lexend'>LOW</p>
                <h4 className=' text-[22px] xsm:text-[25px] md:text-[34px] leading-[25px]'>${data.low}</h4>
              </div>
              <div className=''>
                <p className='font-bold text-[18px] text-[#277b76] font-Lexend'>DIV YIELD</p>
                <h4 className=' text-[22px] xsm:text-[25px] md:text-[34px] leading-[25px]'>{dividendYield}</h4>
              </div>
            </div>
            <h2 className='text-white font-Lexend font-medium text-[20px] xsm:text-[30px] sm:text-[35px] '>6 Month Stock Price History</h2>
          </div>
        </div>

        {/* right */}
        <div>
          <Image
            src="/images/logo.png"
            width={365}
            height={100}
            alt="Company Logo"
          />
        </div>
      </div>
      </>
    );
  }
}

function priceChange(data) {
  const dataDate = parseISO(data.datetime);
  const timeDiff = formatDistanceToNow(dataDate, { addSuffix: true });
  const arrowIcon = data.change >= 0 ? <FaArrowRightLong size={23} className='arrow text-[#679290] font-bold text-sm sm:text-lg' /> : <FaArrowLeftLong size={23} className='arrow text-[#926770] font-bold text-sm sm:text-lg' />;
  const changeSign = data.change >= 0 ? '+' : '-';

  return (
    <>
      {arrowIcon}{data.currency} 
      {" "}{changeSign}{Math.abs(data.change)} ({Math.abs(data.percent_change).toFixed(2)}%){" "}
      {data.is_market_open == true ? 'TODAY' :''}
    </>
  );
}
function convertTime(UNIX_timestamp) {
  var date = new Date(UNIX_timestamp * 1000);

  const formatting = {
    timeZone: "America/New_York",    
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  var modifiedTime = new Intl.DateTimeFormat("en-US", formatting).format(date);
  return modifiedTime;
}

function convertDate(UNIX_timestamp) {
  var date = new Date(UNIX_timestamp * 1000);

  const formatting = {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  var modifiedDate = new Intl.DateTimeFormat("en-US", formatting).format(date);
  return modifiedDate;
}