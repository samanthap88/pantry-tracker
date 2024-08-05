"use client"

import DataTable from "./table"
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { collection, addDoc , deleteDoc, getDoc, doc, updateDoc} from "firebase/firestore";
import { db } from '../../firebase';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';


export default function Home() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({name: '', quantity: 0, expirationDate: '' });
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [isEditing, setIsEditing] = useState(false)
  const [selectedItem, setSelectedItem] = useState({name: '', quantity: 0, expirationDate: '' });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddItem = async () => {
    // Generate a unique ID for the new item
    if (isEditing === false) {
      try {
        const pantryCollectionRef = collection(db, 'pantry-items');
        const docRef = await addDoc(pantryCollectionRef, newItem);
        setItems([...items, { ...newItem, id: docRef.id }]);
        setNewItem({name: '', quantity: 0, expirationDate: '' });
        // Optionally refetch items from Firestore after adding a new one
      } catch (error) {
        console.error('Error adding item:', error);
      }

    } else if (isEditing === true) {
      try {
        for (const id of selectionModel) {
          // Delete item from Firestore
          console.log("deleting", id) 
          const docRef = doc(db, 'pantry-items', id as string);
          await updateDoc(docRef, newItem)
        }

        setItems((prevItems) =>
          prevItems.map(item =>
            selectionModel.includes(item.id) ? { ...item, ...newItem } : item
          )
        );

        setNewItem({ name: '', quantity: 0, expirationDate: '' });
        setIsEditing(false)
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
    
    handleClose() 
  };
  const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
    
    setSelectionModel(newSelectionModel);
    if (newSelectionModel.length > 0) {
      const selectedId = newSelectionModel[0];
      const selected = items.find(item => item.id === selectedId);
      if (selected) {
        setSelectedItem(selected);
        setNewItem({
          name: selected.name || '',
          quantity: selected.quantity || 0,
          expirationDate: selected.expirationDate || ''
        });
      } else {
        setSelectedItem({name: '', quantity: 0, expirationDate: '' });
        setNewItem({ name: '', quantity: 0, expirationDate: '' });
      }
    } else {
      setSelectedItem({name: '', quantity: 0, expirationDate: '' });
      setNewItem({ name: '', quantity: 0, expirationDate: '' });
    }
  };
  const handleDeleteSelected = async () => {
    console.log("did it reach here")
    try {
      for (const id of selectionModel) {
        // Delete item from Firestore
        console.log("deleting", id) 
        const docRef = doc(db, 'pantry-items', id as string);
        await deleteDoc(docRef);
      }

      // Remove the deleted items from the local state
      setItems(items.filter(item => !selectionModel.includes(item.id as string)));
      setSelectionModel([]);
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };

  const handleUpdateItem = async () => {
    setOpen(true)
    setIsEditing(true) 
  };

  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Pantry Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Earliest Expiration Date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={newItem.expirationDate}
            onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddItem} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      

      <div className="flex flex-col items-center w-full max-w-4xl ">
        <div className="flex flex-row w-full justify-start gap-2 items-center">
          <button className="border border-black py-2 px-4 rounded-md" onClick={handleClickOpen}>add new item</button>
          <button className="border border-black py-2 px-4 rounded-md" onClick={handleDeleteSelected}>delete</button>
          <button className="border border-black py-2 px-4 rounded-md"onClick={handleUpdateItem}>update item</button>
          <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2  border border-gray-300 rounded w-[450px] mt-4"
      />

        </div>
        
        <DataTable 
        items={items} 
        setItems={setItems} 
        selectionModel={selectionModel} 
        setSelectionModel={setSelectionModel} 
        onSelectionModelChange={handleRowSelection}
        searchTerm = {searchTerm} />
      </div>
    </main>
  );
}
