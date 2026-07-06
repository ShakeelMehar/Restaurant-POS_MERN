import React from 'react'

const MiniCard = ({title, icon, number, footerNum}) => {
  return (
    <div className='bg-card py-5 px-5 rounded-lg w-[50%]'>
        <div className='flex items-start justify-between'>
            <h1 className='text-foreground text-lg font-semibold tracking-wide'>{title}</h1>
            <button className={`${title === "Total Earnings" ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"} p-3 rounded-lg text-foreground text-2xl`}>{icon}</button>
        </div>
        <div>
            <h1 className='text-foreground text-4xl font-bold mt-5'>{
              title === "Total Earnings" ? `PKR ${number}` : number}</h1>
            <h1 className='text-foreground text-lg mt-2'><span className='text-success'>{footerNum}%</span> than yesterday</h1>
        </div>
    </div>
  )
}

export default MiniCard