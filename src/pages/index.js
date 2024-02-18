import { useState } from "react";

export default function Home() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/createMap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country, city, district }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("data:", data);
      const map = document.getElementById("map");
      // yeniden kullanımda görüntüler üst üste gelmesin diye temizlik
      while (map.firstChild) {
        map.removeChild(map.firstChild);
      }

      let minLon = Infinity,
        maxLon = -Infinity,
        minLat = Infinity,
        maxLat = -Infinity;

      data.elements.forEach((element) => {
        if (element.type === "node") {
          minLon = Math.min(minLon, element.lon);
          maxLon = Math.max(maxLon, element.lon);
          minLat = Math.min(minLat, element.lat);
          maxLat = Math.max(maxLat, element.lat);
        }
      });

      const lonRange = maxLon - minLon;
      const latRange = maxLat - minLat;
      const svgWidth = map.clientWidth;
      const svgHeight = map.clientHeight;
      const lonScale = svgWidth / lonRange;
      const latScale = svgHeight / latRange;

      for (const element of data.elements) {
        if (element.type === "node") {
          const scaledLon = (element.lon - minLon) * lonScale;
          const scaledLat = (element.lat - minLat) * latScale;

          const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );

          circle.setAttribute("cx", scaledLon);
          circle.setAttribute("cy", scaledLat);
          circle.setAttribute("r", "2");
          circle.setAttribute("fill", "black");

          map.appendChild(circle);
        }
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <main>
      <div
        className={`flex min-h-screen flex-col items-center justify-between p-24 `}
      >
        <form
          className={`bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4`}
          onSubmit={handleSubmit}
          autoComplete="false"
        >
          <label htmlFor="country" className="m-2">
            Country:
          </label>
          <input
            type="text"
            name="country"
            id="country"
            values={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <label htmlFor="city">City:</label>
          <input
            type="text"
            name="city"
            id="city"
            values={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <label htmlFor="district">District:</label>
          <input
            type="text"
            name="district"
            id="district"
            values={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            type="submit"
            variant="contained"
            color="success"
          >
            Submit
          </button>
        </form>
        <div className={`container  mx-auto`}>
          <svg
            id="map"
            width="1000px"
            height="1000px"
            viewBox="0 0 1000 1000"
          ></svg>
        </div>
      </div>
    </main>
  );
}
