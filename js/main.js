function uuid() {
  return Math.random().toString(16).slice(2);
}

function copy(obj) {
  let result;
  if (obj instanceof Array) {
    result = [...obj];
  } else if (typeof obj === "object") {
    result = { ...obj };
  } else {
    return obj;
  }
  for (let prop of Reflect.ownKeys(result)) {
    result[prop] = copy(result[prop]);
  }
  return result;
}

new Vue({
  el: "#app",
  created() {
    this.contact = this.getNewContact();
    this.contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    this.selectedContactIndex =
      Number(localStorage.getItem("selectedContactIndex")) || 0;
  },
  data: {
    isOpen: false,
    contact: null,
    action: "add",
    selectedContactIndex: null,
    contacts: [],
    phoneTypes: [
      "Mobile",
      "Work",
      "Home",
      "Main",
      "Work fax",
      "Personal fax",
      "Beeper",
      "Other",
      "Personalized"
    ],
    emailTypes: ["Work", "Home", "Other", "Mobile", "Personalized"],
    groups: ["Family", "Work", "Others"]
  },
  methods: {
    getNewContact() {
      return {
        id: uuid(),
        name: "",
        surnames: "",
        company: "",
        title: "",
        isFavorite: false,
        phones: [],
        emails: [],
        groups: {}
      };
    },
    setSelectedContactIndex(index) {
      this.selectedContactIndex = index;
      localStorage.setItem("selectedContactIndex", index);
      if (this.action === "add") {
        this.closeModal();
      }
      if (this.action === "edit" && this.isOpen) {
        this.editContact();
      }
    },
    toggleFavorite() {
      this.selectedContact.isFavorite = !this.selectedContact.isFavorite;
      localStorage.setItem("contacts", JSON.stringify(this.contacts));
    },
    openModal() {
      this.isOpen = true;
    },
    closeModal() {
      this.isOpen = false;
    },
    addContact() {
      this.action = "add";
      this.openModal();
      this.contact = this.getNewContact();
    },
    editContact() {
      this.action = "edit";
      this.openModal();
      this.contact = copy(this.selectedContact);
    },
    addPhone(event) {
      console.log(event);
      this.contact.phones.push({
        number: "",
        type: "Mobile"
      });
    },
    deletePhone(index) {
      this.contact.phones.splice(index, 1);
    },
    addEmail() {
      this.contact.emails.push({
        value: "",
        type: "Work"
      });
    },
    deleteEmail(index) {
      this.contact.emails.splice(index, 1);
    },
    saveContact() {
      if (this.action === "add") {
        this.contacts.push(this.contact);
      } else {
        this.contacts.splice(this.selectedContactIndex, 1, this.contact);
      }
      localStorage.setItem("contacts", JSON.stringify(this.contacts));
      this.contact = this.getNewContact();
      // this.selectedContactIndex = null; //error
      this.closeModal();
    }
  },
  computed: {
    selectedContact() {
      return this.contacts[this.selectedContactIndex];
    },
    selectedContactFullName() {
      return this.selectedContact
        ? `${this.selectedContact.name} ${this.selectedContact.surnames}`
        : "";
    },
    selectedContactProfessionalInformation() {
      return this.selectedContact
        ? `${this.selectedContact.company}${
            this.selectedContact.title ? ", " + this.selectedContact.title : ""
          }`
        : "";
    },
    imageFavorite() {
      return this.selectedContact.isFavorite
        ? "favorite-active.svg"
        : "favorite.svg";
    },
    activeGroups() {
      return Object.keys(this.selectedContact.groups).filter(key => {
        return this.selectedContact.groups[key] === true;
      });
    }
  }
});
