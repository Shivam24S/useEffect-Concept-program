import { useCallback, useEffect, useRef, useState } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";

import { sortPlacesByDistance } from "./loc.js";

function App() {
  // const modal = useRef();
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState([]);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [modalIsOpen, setModelIsOpen] = useState(false);

  // setting user selected places data or displaying that data

  useEffect(() => {
    const selectedIds = JSON.parse(localStorage.getItem("storedID")) || [];

    const selectedPlacesData = selectedIds.map((id) =>
      AVAILABLE_PLACES.find((place) => place.id === id)
    );
    setPickedPlaces(selectedPlacesData);
  }, []);

  // getting user Location

  useEffect(() => {
    //  navigator.geolocation.getCurrentPosition ,position also in built browser objects or tools
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setModelIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModelIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // localStorage for storing  selected place data offline or when user  reload

    // getting selected place id
    const selectedIds = JSON.parse(localStorage.getItem("storedID")) || [];

    // saving selected place id
    if (selectedIds.indexOf(id) === -1) {
      localStorage.setItem("storedID", JSON.stringify([id, ...selectedIds]));
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModelIsOpen(false);

    const selectedIds = JSON.parse(localStorage.getItem("storedID")) || [];
    // deleting selected place data if user delete so delete that id in local storage too
    localStorage.setItem(
      "storedID",
      JSON.stringify(
        // selectedIds.filter((place) => place.id !== selectedPlace.current)
        selectedIds.filter((id) => id !== selectedPlace.current)
      )
    );
  }, []);

  return (
    <>
      {/* <Modal open={modalIsOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal> */}

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        {modalIsOpen && (
          <DeleteConfirmation
            onCancel={handleStopRemovePlace}
            onConfirm={handleRemovePlace}
          />
        )}
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="wait some time till we are fetching your location... "
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
