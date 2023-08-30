import { Users } from "../Models/Users.js";
// import GooglePlacesAutocomplete from "google-places-autocomplete";

export const addToSave = async (req, res) => {
  try {
    const { itemId, userId } = req.body;
    console.log(itemId ,userId)
    const addToSaved = await Users.findByIdAndUpdate(
      userId,
      { $addToSet: { savedItems: { itemId: itemId } } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Item added to saved items",
      data: addToSaved,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
export const removeFromSave = async (req, res) => {
  try {
    const { itemId, userId } = req.query;
    const removeFromSaved = await Users.findByIdAndUpdate(
      userId,
      { $pull: { savedItems: { id: itemId } } },
      { new: true }
    );

    res.status(200).json({
      message: "Item removed from saved items",
      user: removeFromSaved,
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};



// export const suggestLocations = async (req, res) => {
//   try {
//     const { input } = req.body;

//     const placesAutocomplete = new GooglePlacesAutocomplete({
//       apiKey: "YOUR_API_KEY", // Replace with your Google Places API key
//       language: "en", // Set the language for the suggestions (optional)
//     });

//     const response = await placesAutocomplete.getPlacePredictions({ input });

//     const suggestions = response.map((prediction) => prediction.description);

//     res.status(200).json({ suggestions });
//   } catch (error) {
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };
