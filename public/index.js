const itemList = document.querySelector('ul')

function appInit() {
  getItems()
}

function getItems() {
  const url = 'http://localhost:3000/api/v1/essentials'
  try {
    fetch(url)
      .then(res => res.json())
      .then(items => {
        items.forEach(item => {
          let li = document.createElement('li')
          let checkbox = document.createElement('input')
          let deleteButton = document.createElement('button')
          deleteButton.addEventListener('click', deleteItem)
          deleteButton.textContent = 'Delete'
          checkbox.type = "checkbox"
          checkbox.value = item.id
          itemList.append(li)
          li.append(item.item)
          const grabListItems = document.querySelectorAll('li')
          grabListItems.forEach(item => {
            item.append(checkbox)
            item.append(deleteButton)
          })
          if (item.is_packed) {
            checkbox.classList = 'packed'
            checkbox.checked = true
          }
        })
      })
  } catch(error) {
    console.log(error)
  }
}

function deleteItem() {
  const itemId = parseInt(this.previousSibling.value)
  this.parentNode.remove()
  const url = `http://localhost:3000/api/v1/essentials/${itemId}`

  try {
    fetch(url, {
      method: 'DELETE'
    })
      .then(res => console.log(res))
  } catch(error) {
    console.log(error)
  }
}

appInit()
