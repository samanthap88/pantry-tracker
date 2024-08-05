"use client"
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { db } from '../../firebase';
import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import {QuerySnapshot, DocumentData } from 'firebase/firestore';



const columns: GridColDef[] = [
  { field: 'name', headerName: 'name', width: 130 },
  { field: 'quantity', headerName: 'quantity', width: 130 },
  { field: 'expirationDate', headerName: 'expiration date',},
];

export default function DataTable({items, setItems, selectionModel, setSelectionModel, onSelectionModelChange, searchTerm}) {
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  async function fetchPantryItems(): Promise<any[]> {
    const pantryCollectionRef = collection(db, 'pantry-items');
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(pantryCollectionRef);
    
    
    const itemsList: any[] = snapshot.docs.map((doc) => ({
      ...doc.data() as any,
      id: doc.id,
    }));

    setItems(itemsList)
  
    return itemsList;
  }

  useEffect(() => {

      try {
        fetchPantryItems();
        const filtered = items.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
      } catch (error) {
        console.error('Error fetching pantry items:', error);
      }
  }, [searchTerm, items]);
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={filteredItems}
        columns={columns}
        onRowSelectionModelChange={(newSelectionModel) => {setSelectionModel(newSelectionModel); 
          onSelectionModelChange(newSelectionModel) 
        }}
        rowSelectionModel={selectionModel}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
