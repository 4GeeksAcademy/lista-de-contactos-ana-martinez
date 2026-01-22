export const initialStore = () => {
  return {
    contacts: [],
    message: null
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'load_contacts':
      return {
        ...store,
        contacts: action.payload || []
      };

    case 'add_contact':
      if (!action.payload) return store;
      return {
        ...store,
        contacts: [...store.contacts, action.payload],
        message: `✅ Contacto "${action.payload.name}" creado exitosamente`
      };

    case 'update_contact':
      if (!action.payload || !action.payload.id) {
        console.error("Error: payload sin id en update_contact", action.payload);
        return store;
      }
      return {
        ...store,
        contacts: store.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        ),
        message: `✅ Contacto "${action.payload.name}" actualizado exitosamente`
      };

    case 'delete_contact':
      const deletedContact = store.contacts.find(c => c.id === action.payload.id);
      return {
        ...store,
        contacts: store.contacts.filter(contact => contact.id !== action.payload.id),
        message: `🗑️ Contacto "${action.payload.name || deletedContact?.name || ''}" eliminado exitosamente`
      };

    case 'clear_message':
      return {
        ...store,
        message: null
      };

    default:
      throw Error('Unknown action.');
  }
}
