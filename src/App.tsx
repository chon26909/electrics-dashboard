import "./App.scss";
import { useEffect, useState } from "react";
import * as socketIo from "socket.io-client";
import { useDashboardContext } from "./context/DashboardProvider";
import LoadingPage from "./components/LoadingPage";

const App = () => {
  const [electrics, setElectrics] = useState<any>();

  let socket: any;

  const { loading, data } = useDashboardContext();

  // console.log("loading ", loading);

  useEffect(() => {
    socket = socketIo.connect(
      String(process.env.REACT_APP_BASE_URL + "/dashboard"),
      { transports: ["websocket"] }
    );
    // socket.on("fan", (message) => {
    //   console.log(message);
    //   setElectrics(message);
    // });

    socket.onAny(async (eventName: string, args: any) => {
      // console.log("eventName", eventName);
      // console.log("args", args);

      let arr: any[] = [];
      const newData = {
        name: eventName,
        watt: args.watt,
        amp: args.amp,
      };

      console.log("data", newData);
      console.log("electrics.length", electrics);

      if (electrics === undefined) {
        console.log("1");

        setElectrics([newData]);
      } else {
        let foundIndex = electrics.find((old: any) => {
          return old.name === newData.name;
        });

        console.log("foundIndex ", foundIndex);

        if (foundIndex !== -1) {
          let buff = electrics;
          buff[foundIndex] = newData;

          console.log("2");

          console.log("buff", buff);

          setElectrics(buff);
        } else {
          console.log("3");

          const buff = [...electrics, newData];
          setElectrics(buff);
        }
      }

      // if (electrics.length === 0) {

      //   console.log('first');

      //   const d = {
      //     name: eventName,
      //     watt: args.watt,
      //     amp: args.amp,
      //   };
      //   console.log(d);
      //   newData.push(d);
      // } else {

      //   console.log('else ', electrics);

      //   for (let i = 0; i < electrics.length; i++) {

      //     if (electrics[i].name === eventName) {
      //       const d = {
      //         name: electrics[i].name,
      //         watt: args.watt,
      //         amp: args.amp,
      //       };
      //       console.log(d);
      //       newData.push(d);
      //       continue;
      //     } else {
      //       newData.push(electrics[i]);
      //       continue;
      //     }

      //     console.log("newData", newData);
      //   }
      // }
    });

    // return () => {
    //   // socket.disconnect();
    // };
  }, [socket]);

  useEffect(() => {}, [loading]);

  if(loading) { 
    return <LoadingPage/>
  }


  return (
    <div className="App">
      <div className="container">
        <div className="overview">
          <h3>ภาพรวม</h3>
          <div className="list">
            <div className="card">
              <div>
              <img src="https://cdn-icons-png.flaticon.com/512/3798/3798571.png" alt=""/>
              </div>
              <div>
                <div className="month">{data.month.unit} หน่วย</div>
                <div className="day">วันนี้ {data.today.unit} หน่วย</div>
              </div>
            </div>
            <div className="card">
              <div>
              <img src="https://cdn-icons-png.flaticon.com/512/898/898154.png" alt=""/>
              </div>
              <div>
                <div className="month">{data.month.price} บาท</div>
                <div className="day">วันนี้ {data.today.price} บาท</div>
              </div>
            </div>
            <div className="card">
              <div>
              <img src="https://static.vecteezy.com/system/resources/thumbnails/000/627/527/small/illust58-6517-01.jpg" alt=""/>
              </div>
              <div>
                <div className="month">{data.month.co2} หน่วย</div>
                <div className="day">วันนี้ {data.today.co2} หน่วย</div>
              </div>
            </div>
            {/* <div className="card">
            
              <div className="consumption">
                <div className="unit">
                  <div>
                   <img src="https://cdn-icons-png.flaticon.com/512/3798/3798571.png" alt=""/>
                  </div>
               
                  <div className="value">{data.today.unit}</div>
                  <div>หน่วย</div>
                </div>
                <div className="price">
                  <div>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/898/898154.png"
                      alt=""
                    />
                  </div>
              
                  <div className="value">{data.today.price}</div>
                  <div>บาท</div>
                </div>
                <div className="co2">
                  <div>
                    
                    <img
                      src="https://static.vecteezy.com/system/resources/thumbnails/000/627/527/small/illust58-6517-01.jpg"
                      alt=""
                    />
                  </div>
                  <div className="value">{data.today.co2}</div>
                  <div>Kg</div>
                </div>
              </div>
            </div>
            <div className="card bg-yellow">
              <div className="type">เดือนนี้</div>
              <div className="consumption">
                <div className="unit">
                  <div>จำนวน</div>
                  <div className="value">{data.month.unit}</div>
                  <div>หน่วย</div>
                </div>
                <div className="price">
                  <div>คิดเป็นเงิน</div>
                  <div className="value">{data.month.price}</div>
                  <div>บาท</div>
                </div>
                <div className="co2">
                  <div>
                    CO<span className="under">2</span>
                  </div>
                  <div className="value">{data.month.co2}</div>
                  <div>Kg</div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="electrics">
          <h3>เครื่องใช้ไฟฟ้าที่กำลังใช้งาน</h3>
          <div className="list">
            {electrics?.length > 0 ? (
              electrics.map((item: any, index: number) => {
                return (
                  <div className="card" key={index}>
                    <div className="type">{item.name}</div>
                    <div className="value">
                      {item.amp} A {item.watt} W
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no">ไม่มีข้อมูล</div>
            )}

            {/* <div className="card">
              <div className="type">เครื่องใช้ไฟฟ้า 1</div>
              <div className="value">{ 20 } W</div>
            </div>
            <div className="card">
              <div className="type">เครื่องใช้ไฟฟ้า 1</div>
              <div className="value">{ 20 } W</div>
            </div> */}
          </div>
        </div>
        {data.today.unit_per_electric.length > 0 ? (
          <div className="history">
            <h3>ข้อมูลการบริโภคพลังงาน (รายวัน)</h3>
            <div className="table">
              <div className="head">
                <div>เครื่องใช้ไฟฟ้า</div>
                <div>หน่วย</div>
              </div>
              <div>
                {data.today.unit_per_electric.map((item: any) => {
                  return (
                    <div className="row">
                      <div className="name">{item.name}</div>
                      <div>{item.unit}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default App;
