const itemContainer = document.querySelector('.essentials-item-container')

function appInit() {
  getItems()
}

function getItems() {
  const url = 'http://localhost:3000/api/v1/essentials'
  try {
    fetch(url)
      .then(res => res.json())
      .then(items => console.log(items))
  } catch(error) {
    console.log(error)
  }
}

appInit()
