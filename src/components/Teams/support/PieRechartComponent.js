import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
class PieRechartComponent extends React.Component {
   COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF"];
   pieData = [
      {
         name: "kishor",
         value: 54.85,
         fill:'red'
      },
      {
         name: "tezal",
         value: 47.91
      },
      {
         name: "akash",
         value: 16.85
      },
      {
         name: "amit",
         value: 16.14
      },
      {
         name: "rohit",
         value: 10.25
      }
   ];
   CustomTooltip = ({ active, payload, label }) => {
      if (active) {
         return (
            <div
               className="custom-tooltip"
               style={{
                  backgroundColor: "#ffff",
                  padding: "5px",
                  border: "1px solid #cccc"
               }}
            >
               <label>{`${payload[0].name} : ${payload[0].value}`}</label>
            </div>
         );
      }
      return null;
   };
   render() {
      return (
         <>
           
            <PieChart width={500} height={300}>
               <Pie
                  data={this.pieData}
                  color="#000000"
                  dataKey="value"
                  nameKey="name"
                  cx="20%"
                  cy="30%"
                  outerRadius={60}
                  fill="#8884d8"
               >
                  {this.pieData.map((entry, index) => (
                     <Cell
                        key={`cell-${index}`}
                        fill={this.COLORS[index % this.COLORS.length]}
                     />
                  ))}
               </Pie>
               <Tooltip content={<this.CustomTooltip />} />
               {/* <Legend /> */}
            </PieChart>
         </>
      );
   }
}
export default PieRechartComponent;