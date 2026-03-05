"use client";

import React from 'react';
import { TextField } from './ui/TextField';
import { User, Eye, Search, Map, Menu } from 'lucide-react';

export default function TextFieldShowcase() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm max-w-5xl mx-auto space-y-12">
      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800">Variants</h2>
        <div className="flex flex-wrap gap-6">
          <TextField label="Outlined" variant="outlined" />
          <TextField label="Filled" variant="filled" />
          <TextField label="Standard" variant="standard" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800">States</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextField label="Required" required defaultValue="Hello World" />
          <TextField label="Disabled" disabled defaultValue="Hello World" />
          <TextField label="Password" type="password" defaultValue="Password" />
          <TextField label="Read Only" readOnly defaultValue="Hello World" />
          <TextField label="Search field" type="search" />
          <TextField label="Helper text" helperText="Some important text" defaultValue="Default Value" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800">Error State</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Error" error defaultValue="Hello World" />
          <TextField label="Error" error helperText="Incorrect entry." defaultValue="Hello World" />
          <TextField label="Error" variant="filled" error defaultValue="Hello World" />
          <TextField label="Error" variant="filled" error helperText="Incorrect entry." defaultValue="Hello World" />
          <TextField label="Error" variant="standard" error defaultValue="Hello World" />
          <TextField label="Error" variant="standard" error helperText="Incorrect entry." defaultValue="Hello World" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800">Multiline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextField label="Multiline" multiline rows={4} defaultValue="Default Value" />
          <TextField label="Multiline Placeholder" multiline rows={4} placeholder="Placeholder" />
          <TextField label="Multiline" variant="filled" multiline rows={4} defaultValue="Default Value" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800">Icons & Adornments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField 
            label="With a start adornment" 
            startAdornment={<User size={20} />} 
          />
          <TextField 
            label="Password" 
            type="password"
            defaultValue="Password"
            endAdornment={<Eye size={20} className="cursor-pointer" />} 
          />
          <TextField 
            label="Amount" 
            startAdornment={<span className="text-gray-500">$</span>} 
            fullWidth
          />
          <TextField 
            label="Weight" 
            endAdornment={<span className="text-gray-500">kg</span>} 
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800">Sizes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <TextField label="Size" size="small" defaultValue="Small" />
          <TextField label="Size" size="medium" defaultValue="Normal" />
          <TextField label="Size" variant="filled" size="small" defaultValue="Small" />
          <TextField label="Size" variant="filled" size="medium" defaultValue="Normal" />
          <TextField label="Size" variant="standard" size="small" defaultValue="Small" />
          <TextField label="Size" variant="standard" size="medium" defaultValue="Normal" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800">Customized InputBase (Google Maps Style)</h2>
        <div className="flex items-center p-1 bg-white border border-gray-300 rounded-md shadow-sm w-full max-w-md">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <Menu size={20} />
          </button>
          <input 
            type="text" 
            className="flex-1 px-2 py-2 outline-none bg-transparent" 
            placeholder="Search Google Maps" 
          />
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <Search size={20} />
          </button>
          <div className="w-px h-7 bg-gray-300 mx-1"></div>
          <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
            <Map size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
