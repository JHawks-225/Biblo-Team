import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://flpzogciajikcettrevc.supabase.co'
const supabaseKey = 'sb_publishable_yqnXfynEExoA2sbHgKUwRg_hTBmanmc'
const supabase = createClient(supabaseUrl, supabaseKey)

// Authentification
const loginForm = document.getElementById('login-form')
loginForm?.addEventListener('submit', async e => {
  e.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const { user, error } = await supabase.auth.signUp({ email, password })
  if(error) alert(error.message)
  else alert("Inscription / Connexion réussie !")
})

// Upload fichiers
const uploadForm = document.getElementById('upload-form')
uploadForm?.addEventListener('submit', async e => {
  e.preventDefault()
  const file = document.getElementById('file').files[0]
  const { data, error } = await supabase.storage.from('oeuvres').upload(`public/${file.name}`, file)
  if(error) alert(error.message)
  else {
    alert('Fichier uploadé !')
    listFiles()
  }
})

// Lister les fichiers
async function listFiles() {
  const { data, error } = await supabase
    .storage
    .from('oeuvres')
    .list('public')

  if (error) return console.log(error)

  const ul = document.getElementById('liste-oeuvres')
  if (!ul) return

  ul.innerHTML = ''

  data.forEach(f => {
    const { data: urlData } = supabase
      .storage
      .from('oeuvres')
      .getPublicUrl(`public/${f.name}`)

    const li = document.createElement('li')
    li.innerHTML = `<a href="${urlData.publicUrl}" target="_blank">${f.name}</a>`
    ul.appendChild(li)
  })
}

listFiles()
