/* global fetch */
const itemList = document.querySelector('ul')
const submitForm = document.querySelector('.essentials-form')

submitForm.addEventListener('submit', postItem)

function appInit () {
  getItems()
}

function getItems () {
  const url = '/api/v1/essentials'
  try {
    fetch(url)
      .then(res => res.json())
      .then(items => {
        items.forEach(item => {
          let li = document.createElement('li')
          let p = document.createElement('p')
          let checkbox = document.createElement('input')
          let deleteButton = document.createElement('button')
          deleteButton.addEventListener('click', deleteItem)
          deleteButton.textContent = 'Delete'
          deleteButton.classList = 'delete-button'
          checkbox.type = 'checkbox'
          checkbox.value = item.id
          checkbox.addEventListener('click', updatePacked)
          itemList.append(li)
          p.append(item.item)
          li.append(p)
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
  } catch (error) {
    console.log(error)
  }
}

function postItem (e) {
  e.preventDefault()

  const itemName = document.querySelector('.item-input').value

  let li = document.createElement('li')
  li.append(itemName)
  itemList.append(li)
  let checkbox = document.createElement('input')
  let deleteButton = document.createElement('button')
  deleteButton.addEventListener('click', deleteItem)
  deleteButton.textContent = 'Delete'
  checkbox.type = 'checkbox'
  checkbox.addEventListener('click', updatePacked)
  li.append(checkbox)
  li.append(deleteButton)
  if (itemName.length) {
    const url = '/api/v1/essentials'

    try {
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          item: itemName,
          is_packed: false,
          id: Math.floor((Math.random() * 1000))
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(itemId => checkbox.value = itemId)
    } catch (error) {
      console.log(error)
    }
  }
}

function updatePacked () {
  const itemId = parseInt(this.value)
  const isChecked = this.checked

  const url = `/api/v1/essentials/${itemId}`
  try {
    fetch(url, {
      method: 'PATCH',
      body: JSON.stringify({
        is_packed: isChecked
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res)
  } catch (error) {
    console.log(error)
  }
}

function deleteItem () {
  const itemId = parseInt(this.previousSibling.value)
  this.parentNode.remove()
  const url = `/api/v1/essentials/${itemId}`

  try {
    fetch(url, {
      method: 'DELETE'
    })
      .then(res => console.log(res))
  } catch (error) {
    console.log(error)
  }
}

appInit()
