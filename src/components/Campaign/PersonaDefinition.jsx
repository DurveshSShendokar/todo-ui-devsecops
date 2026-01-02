


import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, IconButton, Paper, List, ListItem, ListItemText,
  Divider,
  Checkbox
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { getAllProducts } from "../../Services/ProductService";
import { getAllIndustries, addPersona, getAllPersonas, getAllPersonasDefination, addPersonaDefinations, getIndustriesByProductId } from "../../Services/PersonaService";




const PersonaDefinition = ({ darkMode }) => {
  const [products, setProducts] = useState([]);
  const [industries, setIndustries] = useState([]);
    const [industrie, setIndustrie] = useState([]);
  console.log("industries",industries);
   

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedIndustryId, setSelectedIndustryId] = useState("");
  const [personas, setPersonas] = useState([{ id: 1, name: "" }]);
  const [personaDefinitions, setPersonaDefinitions] = useState([]);
 const [selectedPersonas, setSelectedPersonas] = useState([]);
  // Demo list states (for UI demo purposes only)
  const [demoSelectedProduct, setDemoSelectedProduct] = useState(null);
  const [demoSelectedIndustry, setDemoSelectedIndustry] = useState(null);
const [demoPersonas, setDemoPersonas] = useState([]);
const [mappPersonas, setMappPersonas] = useState([]);

console.log("mappPersonas",mappPersonas);

  useEffect(() => {
    fetchProducts();
    fetchIndustries();
    fetchPersonas();
  }, []);

useEffect(() => {
  const fetchPersonasSelection = async () => {
    if (selectedProductId && selectedIndustryId) {
      try {
        const res = await getAllPersonasDefination(selectedProductId, selectedIndustryId);
         console.log("res",res);
           setMappPersonas(res);
      
      } catch (error) {
        console.error("❌ Error fetching personas:", error);
        setMappPersonas([]);
      }
    }
  };

  fetchPersonasSelection();
}, [selectedProductId, selectedIndustryId]);


  useEffect(() => {
  const fetchPersonasForSelection = async () => {
    if (demoSelectedProduct && demoSelectedIndustry) {
      try {
        const res = await getAllPersonasDefination(demoSelectedProduct.id, demoSelectedIndustry.id);
         console.log("res",res);
           setDemoPersonas(res);
      
      } catch (error) {
        console.error("❌ Error fetching personas:", error);
        setDemoPersonas([]);
      }
    }
  };

  fetchPersonasForSelection();
}, [demoSelectedProduct, demoSelectedIndustry]);



  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  useEffect(() => {
  const loadIndustries = async () => {
    try {
      const data = await getIndustriesByProductId(selectedProductId);
      setIndustries(data.industries); // assuming API returns { industries: [...] }
    } catch (err) {
      console.error("Error loading industries by product", err);
    }
  };

  if (selectedProductId) loadIndustries();
}, [selectedProductId]);

  const fetchIndustries = async () => {
    try {
      const data = await getAllIndustries();
      setIndustrie(data);
    } catch (error) {
      console.error("❌ Error fetching industries:", error);
    }
  };

  const fetchPersonas = async () => {
    try {
      const data = await getAllPersonas();
      if (Array.isArray(data)) setPersonaDefinitions(data);
      else console.error("❌ Invalid persona response");
    } catch (error) {
      console.error("❌ Error fetching personas:", error);
    }
  };

  const handlePersonaChange = (event) => {
    console.log(event);
    
    setSelectedPersonas(event.target.value);
  };

  // const addPersonaField = () => {
  //   setPersonas([...personas, { id: personas.length + 1, name: "" }]);
  // };

  // const removePersonaField = (index) => {
  //   if (personas.length > 1) {
  //     setPersonas(personas.filter((_, i) => i !== index));
  //   }
  // };

 const handleSubmit = async (e) => {
  e.preventDefault();

const selectedIndustry = industries.find(ind => ind.industryId === selectedIndustryId);

  const selectedProduct = products.find(prod => prod.id === selectedProductId);

  if (!selectedIndustry || !selectedProduct) {
    alert("Please select valid product and industry.");
    return;
  }

  const payload = {
    productId: selectedProductId,
    industryId: selectedIndustryId,
    personas: selectedPersonas.map((personaId) => {
      const selectedPersona = personaDefinitions.find(p => p.id === personaId);
      if (!selectedPersona) return null;

      return {
        description: selectedPersona.description || "",
        designation: selectedPersona.designation || "Unknown Designation",
        industry: {
          id: selectedIndustry.id,
          name: selectedIndustry.name,
          description: selectedIndustry.description || ""
        },
        product: {
          id: selectedProduct.id,
          productName: selectedProduct.productName,
          description: selectedProduct.description || "",
          industries: [
            {
              id: selectedIndustry.id,
              name: selectedIndustry.name,
              description: selectedIndustry.description || ""
            }
          ]
        }
      };
    }).filter(Boolean), // remove any null if persona not found
  };

  try {
    await addPersonaDefinations(payload);
    alert("Persona Definations saved!");
    setSelectedProductId("");
    setSelectedIndustryId("");
    setSelectedPersonas([]);
  } catch (error) {
    alert("Failed to save persona.");
    console.error(error);
  }
};


  const [searchTerm, setSearchTerm] = useState("");

   const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
   const filteredIndusties = industrie.filter((Industies) =>
    Industies.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    
    <Box sx={{ p: 4,mt:4, background: darkMode ? "#202020" : "#fff" }}>
      {/* === Form Section === */}
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Persona Definition
      </Typography>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">  <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Product</InputLabel>
          <Select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.productName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Industry</InputLabel>
          <Select
            value={selectedIndustryId}
            onChange={(e) => setSelectedIndustryId(e.target.value)}
            required
          >
            {industries.map((industry) => (
           <MenuItem key={industry.industryId} value={industry.industryId}>
  {industry.industryName}
</MenuItem>

            ))}
          </Select>
        </FormControl></div>
      

        {/* <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
          Personas
        </Typography>
<div>    </div>
        {personas.map((persona, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <TextField
              fullWidth
              label={`Persona ${index + 1}`}
              value={persona.name}
              onChange={(e) => handlePersonaChange(index, e.target.value)}
              required
            />
            <IconButton color="error" onClick={() => removePersonaField(index)}>
              <RemoveCircle />
            </IconButton>
          </Box>
        ))}

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
  <Button
    variant="outlined"
    startIcon={<AddCircle />}
    onClick={addPersonaField}
  >
    Add Persona
  </Button>
</Box> */}

  {/* <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Personas</InputLabel>
          <Select
            multiple
            value={selectedPersonas}
            onChange={handlePersonaChange}
            renderValue={(selected) => selected.map(id => personaDefinitions.find(p => p.id === id)?.designation).join(", ")}
          >
            {personaDefinitions.map((persona) => (
              <MenuItem key={persona.id} value={persona.id}>
                <Checkbox checked={selectedPersonas.indexOf(persona.id) > -1} />
                <ListItemText primary={persona.designation} />
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

<FormControl fullWidth sx={{ mt: 3 }}>
  <InputLabel>Personas</InputLabel>
  <Select
    multiple
    value={selectedPersonas}
    onChange={(e) => setSelectedPersonas(e.target.value)}
    renderValue={(selected) =>
      selected
        .map((id) =>
          mappPersonas.data.find((p) => p.id === id)?.designation
        )
        .join(", ")
    }
  >
    {mappPersonas?.data?.map((persona) => (
      <MenuItem key={persona.id} value={persona.id}>
        <Checkbox checked={selectedPersonas.includes(persona.id)} />
        <ListItemText primary={persona.designation} />
      </MenuItem>
    ))}
  </Select>
</FormControl>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}> 
          Submit
        </Button>
      </form>
<Divider sx={{ my: 4 }} />

      {/* === Demo Data Section === */}
  <Box sx={{ mt: 5 }}>
        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={3}>
           Persona List
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
       <Paper
  sx={{
    flex: 1,
    p: 2,
    border: "1px solid #000",
    height: 400,
    display: "flex",
    flexDirection: "column",
    bgcolor: (theme) => theme.palette.mode === "dark" ? "#000" : "#fff"
  }}
>
      <Typography fontWeight="bold" mb={1}>Select Products</Typography>

      <TextField
        placeholder="Search product..."
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 1 }}
      />

      {/* Scrollable list container */}
      <List sx={{ overflowY: "auto", flex: 1 }}>
        {filteredProducts.map((product) => (
          <ListItem
            button
            key={product.id}
            selected={demoSelectedProduct?.id === product.id}
            onClick={() => {
              setDemoSelectedProduct(product);
            }}
          >
            <ListItemText primary={product.productName} />
          </ListItem>
        ))}
      </List>
    </Paper>

<Paper
  sx={{
    flex: 1,
    p: 2,
    border: "1px solid #000",
    height: 400,
    display: "flex",
    flexDirection: "column",
    bgcolor: (theme) => theme.palette.mode === "dark" ? "#000" : "#fff"
  }}
>
  <Typography fontWeight="bold" mb={1}>Select Industries</Typography>

  <TextField
    placeholder="Search Industries..."
    size="small"
    fullWidth
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    sx={{ mb: 1 }}
    disabled={!demoSelectedProduct}
  />

  <List sx={{ overflowY: "auto", maxHeight: 300 }}>
    {!filteredIndusties ? (
      <ListItem>
        <ListItemText primary="Please select a product to view industries." />
      </ListItem>
    ) : (

      filteredIndusties.map((industry) => (
        <ListItem
          button
          key={industry.id}
          selected={demoSelectedIndustry?.id === industry.id}
          onClick={() => setDemoSelectedIndustry(industry)}
        >
          <ListItemText primary={industry.name} />
        </ListItem>
      ))
      
    )}
  </List>
</Paper>



         {demoSelectedIndustry && (
  <Paper
    sx={{
      flex: 1,
      p: 2,
      border: "1px solid #000",
      height: 400,
      display: "flex",
      flexDirection: "column",
      bgcolor: (theme) => theme.palette.mode === "dark" ? "#000" : "#fff"
    }}
  >
    <Typography fontWeight="bold" mb={1}>Personas</Typography>
    <List>
      {demoPersonas.length !== 0 ? (
        demoPersonas.data.map((persona) => (
          <ListItem key={persona.id}>
            <ListItemText
              primary={persona.designation}
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    Description: {persona.product.description}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No personas found for this selection." />
        </ListItem>
      )}
    </List>
  </Paper>
)}

        </Box>
      </Box>
    </Box>
  );
};

export default PersonaDefinition;
