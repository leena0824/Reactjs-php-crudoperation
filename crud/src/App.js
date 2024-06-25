import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [age, setAge] = useState(0);
  const [id, setId] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    fetch('http://localhost/backend.php')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleEdit = (id) => {
    const dt = data.filter(item => item.id === id);
    if (dt.length > 0) {
      setIsUpdate(true);
      setId(id);
      setFirstName(dt[0].firstname);
      setLastName(dt[0].lastname);
      setAge(dt[0].age);
    }
  }

  const handleDelete = (id) => {
    if (id > 0) {
      if (window.confirm("Are you sure to delete this item?")) {
        fetch('http://localhost/backend.php?id=${id}', {
          method: 'DELETE',
        })
          .then(response => response.json())
          .then(() => setData(data.filter(item => item.id !== id)))
          .catch(error => console.error('Error deleting data:', error));
      }
    }
  }

  const handleSave = (e) => {
    e.preventDefault();
    let error = '';

    if (firstname === '') error += 'First Name is required!!';
    if (lastname === '') error += 'Last Name is required!!';
    if (age <= 0) error += 'Age is required!!';

    if (error === '') {
      const newObject = {
        firstname: firstname,
        lastname: lastname,
        age: age
      };

      fetch('http://localhost/backend.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObject)
      })
        .then(response => response.json())
        .then((response) => {
          console.log(response.message);
          if (response.message === "New record created successfully") {
            fetch('http://localhost/backend.php')
              .then(response => response.json())
              .then(data => setData(data))
              .catch(error => console.error('Error fetching data:', error));
          }
          handleClear();
        })
        .catch(error => console.error('Error saving data:', error));
    } else {
      alert(error);
    }
  }

  const handleUpdate = () => {
    const updatedObject = {
      id: id,
      firstname: firstname,
      lastname: lastname,
      age: age
    };

    fetch('http://localhost/backend.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedObject)
    })
      .then(response => response.json())
      .then((response) => {
        console.log(response.message);
        if (response.message === "Record updated successfully") {
          fetch('http://localhost/backend.php')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
        }
        handleClear();
      })
      .catch(error => console.error('Error updating data:', error));
  }

  const handleClear = () => {
    setId(0);
    setFirstName('');
    setLastName('');
    setAge(0);
    setIsUpdate(false);
  }

  return (
    <div className="App">
      <form>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "20px" }}>
          <div>
            <label>First Name:</label>
            <input type="text" placeholder="Enter your Name" value={firstname} onChange={(e) => setFirstName(e.target.value)} />

            <label>Last Name:</label>
            <input type="text" placeholder="Enter your Surname" value={lastname} onChange={(e) => setLastName(e.target.value)} />

            <label>Age:</label>
            <input type="number" placeholder="Enter your Age" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="app-my">
            {
              !isUpdate ?
                <button  className="btn btn-primary"  onClick={(e) => handleSave(e)}>Save</button>
                :
                <button className="btn btn-primary"  onClick={() => handleUpdate()}>Update</button>
            }
            <button  className="btn btn-danger" onClick={() => handleClear()}>Clear</button>
          </div>
        </div>
      </form>
      <table className="table table-hover">
        <thead>
          <tr>
            <td>Sr.No</td>
            <td>Id</td>
            <td>First Name</td>
            <td>Last Name</td>
            <td>Age</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody> 
          {
            data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.firstname}</td>
                  <td>{item.lastname}</td>
                  <td>{item.age}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>Edit</button>&nbsp;
                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;