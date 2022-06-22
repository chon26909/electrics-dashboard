import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface UnitPerElectric {
  name: string;
  unit: string;
}

interface DashboardData {
  today: {
    unit: string;
    unit_per_electric: UnitPerElectric[];
    co2: string;
    price: string;
  };
  month: {
    unit: string;
    co2: string;
    price: string;
  };
}

const initialData = {
  loading: false,
  data: {
    today: {
      unit: "",
      unit_per_electric: [],
      co2: "",
      price: "",
    },
    month: {
      unit: "",
      co2: "",
      price: "",
    },
  },
};

const DashboardContext = createContext<any>({});
export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

type Props = {
  children: JSX.Element;
};

const DashboardProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [dataDashboard, setDataDashboard] = useState<DashboardData>(
    initialData.data
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = process.env.REACT_APP_BASE_URL + "/api/electrics";
        const { data } = await axios.get(url);
        setDataDashboard(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    if (!fetched) {
      setFetched(true);
      fetchData();
    }
  }, []);

  const dashboardStore = {
    loading,
    data: dataDashboard,
  };

  return (
    <DashboardContext.Provider value={dashboardStore}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
