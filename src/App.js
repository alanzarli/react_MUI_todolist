import { Typography, Input, Container, Button, IconButton } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function App() {
  const [checked, setChecked] = useState([0]);
  const [ inputs, setInputs ] = useState({});
  const [ tasks, setTasks ] = useState([]);
  const [ finishedTasks, setFinishedTasks] = useState([]);

      function getTasks() {
          axios.get('http://localhost:8888/apiTODOLIST/index.php').then(function(response){
            setTasks(response.data);
        })
      };

      function getFinishedTasks() {
        axios.get('http://localhost:8888/apiTODOLIST/finish.php').then(function(response){
          setFinishedTasks(response.data);
        })
      }

      useEffect(() => {
        getTasks();
        getFinishedTasks();
    }, []);
    
    const handleChange = (event) => {
        const nom = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [nom]: value}))
    }

    const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const handleTasks = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8888/apiTODOLIST/index.php', inputs).then(function(response){
          window.location.reload();
        });
  }
  const handleFormCheckbox = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8888/apiTODOLIST/index.php/${checked}`, tasks).then(function(response){
      window.location.reload();
  });

  }
    return (
      <>
        <Container>
          <Typography variant="h1" align='center'>TO DO LIST</Typography>
          <div style={{ display: "flex", margin: 'auto',justifyContent: "center", marginTop: "100px"  }}>
            <form onSubmit={handleTasks}>
            <Input type='text' name='content' style={{ width: '300px'}} onChange={handleChange} />
            <Button type='submit'>Add</Button>
            </form>
          </div>
        </Container>
        <main> 
          <Typography variant='h2' style={{marginTop: '100px'}} align='center'> Remaining Tasks </Typography>
          <form onSubmit={handleFormCheckbox}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto', marginTop: '100px' }}>
            {tasks.map(({id,content}) => {
              const labelId = `checkbox-list-label-${id}`;

              const deleteTasks = (id) =>  {
                axios.delete(`http://localhost:8888/apiTODOLIST/index.php/${id}`).then(function(response){
                  window.location.reload();
                });
              }

              return (
                <ListItem
                  key={id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="comments" onClick={() => deleteTasks(id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton role={undefined} onClick={handleToggle(id)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={content} style={{textAlign:'center'}} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <button type="submit" style={{display: "flex", margin: 'auto',padding: "10px"}}>Finish</button> 
          </form>  
          <Typography variant='h2' style={{marginTop: '100px'}} align='center'>Finished Tasks </Typography>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto', marginTop: '100px' }}>
            {finishedTasks.map(({id,content}) => {
              const labelId = `checkbox-list-label-${id}`;

              const deleteTasks = (id) =>  {
                axios.delete(`http://localhost:8888/apiTODOLIST/index.php/${id}`).then(function(response){
                  console.log(response.data);
                  window.location.reload();
                });
              }

              return (
                <ListItem
                  key={id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="comments" onClick={() => deleteTasks(id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton role={undefined} onClick={handleToggle(id)} dense>
                    <ListItemText id={labelId} primary={content} style={{textAlign:'center'}} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </main>
      </>
  );
}

export default App;
