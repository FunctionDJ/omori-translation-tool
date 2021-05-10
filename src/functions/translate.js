const axios = require("axios").default
const FormData = require("form-data")

const endpoint = "https://api-free.deepl.com/v2/translate"

const getForm = jsonBody => {
  const form = new FormData()
  
  form.append("auth_key", process.env.DEEPL_API_KEY)
  form.append("text", jsonBody.text)
  form.append("target_lang", jsonBody.target_lang)
  form.append("source_lang", "EN")
  form.append("preserve_formatting", "1")
  form.append("formality", "less")

  return form
}

exports.handler = async event => {
  const form = getForm(JSON.parse(event.body))

  const config = {
    headers: form.getHeaders()
  }

  const response = await axios.post(endpoint, form, config)

  return {
    statusCode: response.status,
    body: JSON.stringify(response.data)
  }
}