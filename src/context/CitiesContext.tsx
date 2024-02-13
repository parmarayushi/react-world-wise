import { createContext, useContext, useEffect, useReducer } from "react";

const BASE_URL = "http://localhost:3000";

const CitiesContext = createContext({});

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payLoad,
      };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payLoad };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payLoad],
        currentCity: action.payLoad,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: [
          state.cities.filter((city: any) => city.id !== action.payLoad),
        ],
        currentCity: {},
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payLoad };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }: any) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payLoad: data });
        // setCities(data);
      } catch {
        dispatch({
          type: "rejected",
          payLoad: "There was an error loading data...",
        });
        // alert("There was an error loading data...");
      }
    }
    fetchCities();
  }, []);

  async function getCity(id: any) {
    if (id === currentCity.id) return;

    dispatch({ type: "loading" });

    try {
      // setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payLoad: data });
      // setCurrentCity(data);
    } catch {
      dispatch({
        type: "rejected",
        payLoad: "There was an error loading cities...",
      });
      // alert("There was an error loading cities...");
    }
  }

  async function createCity(newCity: any) {
    dispatch({ type: "loading" });

    try {
      // setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "Post",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payLoad: data });
      // setCities((cities) => [...cities, data]);
    } catch {
      dispatch({
        type: "rejected",
        payLoad: "There was an error creating city...",
      });
      // alert("There was an error creating city...");
    }
  }

  async function deleteCity(id: any) {
    dispatch({ type: "loading" });

    try {
      // setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "Delete",
      });
      dispatch({ type: "city/deleted", payLoad: id });
      // setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      dispatch({
        type: "rejected",
        payLoad: "There was an error deleting city...",
      });
      // alert("There was an error deleting city...");
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    alert("Cities Context is used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
