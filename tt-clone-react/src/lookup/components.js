function getCookie(name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";")
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim()
          if (cookie.substring(0, name.length + 1) === (name + "=")) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
              break
          }
      }
  }
  return cookieValue
}

export function backendLookup(method, endpoint, callback, data, isFormData=false) {
  let jsonData
  if (data && !isFormData) {
    jsonData = JSON.stringify(data)
  }
  const xhr = new XMLHttpRequest()
  const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api${endpoint}`
  xhr.responseType = "json"
  const csrftoken = getCookie("csrftoken")
  xhr.open(method, url)
  if (!isFormData) {
    xhr.setRequestHeader("content-type", "application/json")
  } else {
    xhr.setRequestHeader("enctype", "multipart/form-data")
  }
  if (csrftoken) {
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
    xhr.setRequestHeader("X-CSRFToken", csrftoken)
  }
  xhr.onload = function() {
    if (xhr.status === 403) {
      const detail = xhr.response.detail
      if (detail === "Authentication credentials were not provided.") {
        if (window.location.href.indexOf("login") === -1) {
          window.location.href = "/login?showLoginRequired=true"
        }
      }
    }
    callback(xhr.response, xhr.status)
  }
  xhr.onerror = function(e) {
    console.log(e)
    callback({"message": "An error occurred."}, 400)
  }
  if (isFormData) {
    xhr.send(data)
  } else {
    xhr.send(jsonData)
  }
}