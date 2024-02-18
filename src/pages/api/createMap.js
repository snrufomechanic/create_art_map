import fetch from "node-fetch";
import axios from "axios";

export default async function handler(req, res) {
  const zip = function (_points) {
    const result = [];
    for (let i = 0; i < _points.length; i++) {
      result.push([_points[i].x, _points[i].y]);
    }
    return result;
  };

  const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search.php";
  const OVERPASS_API_URL = "https://lz4.overpass-api.de/api/interpreter";

  const country = req.body.country;
  const city = req.body.city;
  const district = req.body.district;

  const location = `${country}, ${city}, ${district}`;
  try {
    var nominatimResponse = await fetch(
      NOMINATIM_URL +
        "?q=" +
        country +
        "+" +
        city +
        "+" +
        district +
        "&format=json"
    );

    const data = await nominatimResponse.json();

    if (data) {
      const latitude = parseFloat(data[0].lat);
      const longitude = parseFloat(data[0].lon);

      console.log("latitude:", latitude);
      console.log("longitude:", longitude);

      const overpassQuery = `[out:json];way["highway"](${latitude - 0.05},${
        longitude - 0.05
      },${latitude + 0.05},${longitude + 0.05});(._;>;);out;`;

      const overpassResponse = await axios.get(OVERPASS_API_URL, {
        params: { data: overpassQuery },
        headers: { "Content-Type": "application/json" },
      });

      const overpassData = overpassResponse.data;

      console.log("overpass data:", overpassData);

      // önce burada görüntü oluştmayı denedim başaramadım ^^

      // const outCanvas = new canvas.Canvas(600, 600);
      // const outCtx = outCanvas.getContext("2d");

      // for (const element of overpassData.elements) {
      //   if (element.type === "way") {
      //     const points = [];
      //     for (const nodeId of element.nodes) {
      //       const node = overpassData.elements.find(
      //         (e) => e.type === "node" && e.id === nodeId
      //       );
      //       if (node) {
      //         points.push([parseFloat(node.lon)], parseFloat(node.lat));
      //       }
      //     }
      //     if (points.length && outCtx) {
      //       console.log(points);
      //       const [x, y] = zip(points);
      //       console.log("x,y zipped");
      //       console.log(x);
      //       console.log(y);
      //       outCtx.strokeStyle = "white";
      //       outCtx.beginPath();
      //       outCtx.moveTo(x[0], y[0]);
      //       for (let i = 1; i < x.length; i++) {
      //         outCtx.lineTo(x[i], y[i]);
      //       }
      //       outCtx.stroke();
      //     }
      //   }
      // }
      res.setHeader("Content-Type", "image/png");
      res.send(overpassData);
    } else {
      res.status(400).json({ message: "Invalid location" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    console.log("finally");
  }
}
