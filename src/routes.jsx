import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Contact } from "./pages/Contact";
import { AddContact } from "./pages/AddContact";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Contact />} />
      <Route path="/add" element={<AddContact />} />
      <Route path="/edit/:contactId" element={<AddContact />} />

    </Route>
  )
);