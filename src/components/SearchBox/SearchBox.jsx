import "./SearchBox.css";

function SearchBox() {
  return (
    <div className="search-box">

      <div className="field">
        <label>DESTINATION</label>

        <select>
          <option>Pokhara</option>
          <option>Kathmandu</option>
        </select>
      </div>

      <div className="field">
        <label>PICKUP DATE</label>

        <input type="date" />
      </div>

      <div className="field">
        <label>VEHICLE TYPE</label>

        <select>
          <option>Any</option>
          <option>Car</option>
          <option>Jeep</option>
        </select>
      </div>

      <button className="search-btn">
        Search →
      </button>

    </div>
  );
}

export default SearchBox;