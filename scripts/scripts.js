let openBtn = $('.fa-bars');
let closeBtn = $('.fa-xmark');
let sideBar = $('.sidebar')
let links = $('.links');
let icons = $('.icons')
let linkAnimate = $('ul.mt-5 li')
let loader = $('#loader')


let iconLeft = icons.offset().left;
let linksWidth = links.width();


sideBar.css({
    left:`-${linksWidth}px`
})
closeBtn.addClass('d-none')
openBtn.removeClass('d-none')

$(document).ready(function(){
  $('#loader').fadeOut(1000,function(){ $('body').css('overflow','visible');
  $('#loader').addClass('d-none')
    $('body').addClass('overflow-visible')
})
})

openBtn.click(function(){
    sideBar.animate({left:0},1000)
    openBtn.addClass('d-none')
    closeBtn.removeClass('d-none')
    linkAnimate.addClass('animate__animated')
    linkAnimate.addClass('animate__backInUp')
    linkAnimate.removeClass('animate__backOutDown')
})
closeBtn.click(function(){
    sideBar.animate({left:`-${linksWidth}`},1000)
    openBtn.removeClass('d-none')
    closeBtn.addClass('d-none')
    linkAnimate.addClass('animate__animated')
    linkAnimate.addClass('animate__backOutDown')
    linkAnimate.removeClass('animate__backInUp')
})


// ------------- display Food Function ---------------
let mealArr = []
let categoryArr = []
let currentSearch = { name: '', firstLetter: '' };
const displayOrSearchFood = async (s='',f='',c='',a='',i='') => {
  let response;
  if(c === 'categories'){
         response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    }else if(i){
      response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${i}`)
    }
   else if(f){
    response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${f}`)
} else if(a){
  response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${a}`)
}
    else{
         response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${s}`)
    }
    const data = await response.json()
    console.log(data);
    $(".meals").addClass('d-none')
    const mealArray = data.meals
    const categoryArray = data.categories
    let catOrMeal = mealArray || categoryArray
    let id;
    catOrMeal.forEach((element) => {
     let card = `<div
       class="col-lg-3 col-md-3 col-sm-12 col-12 meals  overflow-hidden" id="card"  data-id="${element.idMeal || element.idMeal}" ${element.strCategory ? `data-category="${element.strCategory}"` : ''}
     >
     <div class="position-relative">
       <div
         class="white-filter  position-absolute top-100 bottom-0 start-0 end-0 d-flex align-items-center rounded-3"
       >
       <div class="d-flex flex-column justify-content-center align-items-center text-center">
       <span class="fs-3 ms-5 name">${element.strMeal || element.strCategory}</span>
       ${element.strCategoryDescription ? `<div>${element.strCategoryDescription.substring(0, 100)}</div>` : ''}
       </div>
     </div>
       <img src="${element.strMealThumb || element.strCategoryThumb}" class="w-100 rounded-3" alt="food img" />
     </div>
     </div>`
       $("#content").append(card);
      });
      $("#content").on("click", ".meals", function() {
        id = $(this).data("id")
        const meal = new Meal()
        meal.displayDetailsMeal(id)
   });
      if(response.ok){
        return id
      }
}
displayOrSearchFood();





class Meal{
    constructor(title,img,instructions,area,category,recipes,tags,source,youtube){
        this.title = title
        this.img = img
        this.instructions = instructions
        this.area = area
        this.category = category
        this.recipes = recipes
        this.tags = tags
        this.source = source
        this.youtube = youtube
    }
    async displayDetailsMeal(id){
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        const data = await response.json()
        let ingredient;
        for (let i = 1; i <= 20; i++) {
           ingredient = data.meals[0][`strIngredient${i}`];
        }
        let tagArr = []
        let strTags = data.meals[0].strTags;
        if(strTags != null){
            strTags.split(',').forEach(element => {
                tagArr.push(element)
            });
        }
        let result = `  <div class="col-lg-4 col-md-5 col-sm-12 col-12 text-white">
        <img src="${data.meals[0].strMealThumb}" alt="" class="w-100 rounded-3" />
        <span class='fs-3'>${data.meals[0].strMeal}</span>
      </div>
      <div class="col-6 col-md-6 col-sm-12 col-12 text-white">
        <h2>Instructions</h2>
        <p>
         ${data.meals[0].strInstructions}
        </p>
        <p>Area : ${data.meals[0].strArea}</p>
        <p>Category : ${data.meals[0].strCategory}</p>
        <p>Recipes :</p>
        <div>
          <ul class="recipes list-unstyled  d-flex flex-wrap justify-content-start ">
         ${ingredient && `<li>${ingredient}</li>`}
          </ul>
        </div>
        <p>Tags :</p>
        <div>
          <ul class="recipes list-unstyled  d-flex flex-wrap justify-content-start">
             ${tagArr && tagArr.map(element => `<li class="bg-warning">${element}</li>`)}
          </ul>
        </div>
        <button class="btn btn-success"><a href="${data.meals[0].strSource}" class="text-decoration-none text-white" target='_blank' >source</a></button>
        <button class="btn btn-danger"><a href="${data.meals[0].strYoutube}" class="text-decoration-none text-white" target='_blank' >Youtube</a></button>
      </div>`
      $("#content").empty();
      $("#content").append(result);
    }
}

$('#search').click(async () => {
  $("#content").empty();
  let search = `
  <div class="col-12 col-md-6 col-sm-12">
  <input type="text" class="form-control bg-black text-white w-75" placeholder="Search by name" id="nameMeal">
</div>
<div class="col-12 col-md-6 col-sm-12">
  <input type="text" class="form-control bg-black text-white w-75" placeholder="Search by First letter" id="firstLetter">
</div>
  `
  $("#content").append(search)
  $('#nameMeal').on('input', function () {
   currentSearch.name = $(this).val()
   if (currentSearch.name.length >= 3) {
    displayOrSearchFood(currentSearch.name);
  }
    });

    $('#firstLetter').on('input', function () {
      currentSearch.firstLetter = $(this).val();
      if (currentSearch.firstLetter.length === 1) {
        displayOrSearchFood('', currentSearch.firstLetter);
      }});
})

$('#categories').click(async () => {
  $("#content").empty();
 displayOrSearchFood('', '', 'categories');
  $('#content').on('click', '.meals', function (e) {
    let nameCategory = $(e.target).closest('.meals').data('category')
    $("#content").empty();
    displayOrSearchFood(nameCategory)
  })
})


const displayAreaOrIngredient = async (a='',i='',src='fa-solid fa-house-laptop') => {
  let response;
  if(i === ''){
    response = await fetch('http://www.themealdb.com/api/json/v1/1/list.php?i=list')
  }else if(a === ''){
    response = await fetch('http://www.themealdb.com/api/json/v1/1/list.php?a=list')
  }
  const data = await response.json()
  let dataArr = []
  let indArr = []
  let indDes = []

  if(i === 'gg'){
    dataArr = data.meals
    console.log(dataArr);
  }else if(a === 'gg'){
    dataArr = data.meals
    for(let i=0;i<20;i++){
      indArr.push(dataArr[i].strIngredient)
      indDes.push(dataArr[i].strDescription)
    }
  }
 dataArr = i=='gg'?dataArr:indArr

  dataArr.forEach((element)=>{
  let areaOrIng = `<div class="col-lg-3 col-md-3 col-sm-12 col-12 mt-5 areaOrIng" ${i=='gg'? `data-area="${element.strArea}"`:`data-ingredient="${element}"`}} >
  <div class="d-flex flex-column align-items-center area-ing">
      <i class=" ${src} house-icon text-white"></i>
      <span class="text-white fs-1">${i=='gg'? `${element.strArea}`:`${element.split(' ').slice(0,2).join(' ')}`}</span>
  </div>
</div>`
  $("#content").append(areaOrIng)
 }) 
 {i=='gg'?$('#content').on('click', '.areaOrIng', function (e) {
  $("#content").empty();
  let nameAreaOrIng = $(e.target).closest('.areaOrIng').data('area')
  displayOrSearchFood('','','',nameAreaOrIng)
}):$('#content').on('click', '.areaOrIng', function (e) {
  $("#content").empty();
  let nameAreaOrIng = $(e.target).closest('.areaOrIng').data('ingredient')
  displayOrSearchFood('','','','',nameAreaOrIng)
})}
}
$('#area').click(async ()=>{
  $("#content").empty();
  displayAreaOrIngredient('','gg');
})

$('#ingredients').click(async ()=>{ 
  $("#content").empty();
  displayAreaOrIngredient('gg','','fa-solid fa-drumstick-bite')
})

const nameValidate = /^[a-zA-Z]{3,}\s+[a-zA-Z]{3,}$/;
const emailValidate = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordValidate =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;


$('#contact').click(()=>{
  $("#content").empty();
  let form = `<div class='w-100 d-flex justify-content-center align-items-center min-vh-100'>
  <dir class="col-12 col-lg-8 col-md-8 col-sm-12  ">
  <div class="form">
  <div class="d-flex">
    <div class="mb-2 ms-5">
      <input type="text" class="form-control ms-5 mb-2 form" placeholder="Enter your name" id="name">
      <div class="alert alert-danger w-100 ms-5 d-none "  role="alert"> the name should be first and last name </div>
    </div>
    <div class="mb-2 ms-5">
        <input type="email" class="form-control ms-5 mb-2 form" placeholder="Enter your email" id="email">
        <div class="alert alert-danger w-100 ms-5 d-none"  role="alert"> the email should include an ‘@’ and a ‘.’ </div>
    </div>
    </div>
    <div  class="d-flex ">
      <div class="mb-2 ms-5">
          <input type="tel" class="form-control ms-5 mb-2 form" placeholder="Enter your phone" id="phone">
          <div class="alert alert-danger w-100 ms-5 d-none"   role="alert"> the phone should be 10 numbers without zero </div>
      </div>
      <div class="mb-2 ms-5">
          <input type="number" class="form-control ms-5 mb-2 form" placeholder="Enter your age" id="age">
          <div class="alert alert-danger w-100 ms-5 d-none"   role="alert"> the age should be between 18 and 60 and postive </div>
      </div>
    </div>
    <div  class="d-flex ">
      <div class="mb-2 ms-5">
          <input type="password" class="form-control ms-5 mb-2 form" placeholder="Enter your password" id="password">
          <div class="alert alert-danger w-100 ms-5 d-none"  role="alert"> the password should be at least 8 characters </div>
      </div>
      <div class="mb-2 ms-5">
          <input type="password" class="form-control ms-5 mb-2 form" placeholder="Enter your repassword" id="repassword">
          <div class="alert alert-danger w-100 ms-5  d-none"  role="alert"> the password should be same password </div>
      </div>
    </div>
</div>
  <div class="text-center mt-3">
      <button class="btn btn-danger px-5"  id="submitButton"  disabled>Submit</button>
  </div>
  </div>`
  $("#content").append(form)

  validateInputs();
})

function validateInputs() {
  validateInput('name', nameValidate);
  validateInput('email', emailValidate);
  validateInput('phone', /^[0-9]{10}$/);
  validateInput('age', /^(1[89]|[2-5]\d|60)$/);
  validateInput('password', passwordValidate);
  validateInput('repassword', passwordValidate, true);
}


function validateInput(inputId, validationRegex, isRepassword = false) {
  $(`#${inputId}`).on('input', function () {
    let isValid = validationRegex.test($(`#${inputId}`).val());
    if (isValid) {
      if (isRepassword) {
        isValid = $(`#${inputId}`).val() === $("#password").val();
      }
      if (isValid) {
        $(`#${inputId}`).removeClass("is-invalid")
        $(`#${inputId}`).addClass("is-valid")
        $(`#${inputId}`).siblings("div").addClass("d-none")
      } else {
        $(`#${inputId}`).removeClass("is-valid")
        $(`#${inputId}`).addClass("is-invalid")
        $(`#${inputId}`).siblings("div").removeClass("d-none")
      }
    } else {
      $(`#${inputId}`).removeClass("is-valid")
      $(`#${inputId}`).addClass("is-invalid")
      $(`#${inputId}`).siblings("div").removeClass("d-none")
    }
    if ($('#name').hasClass('is-valid') && $('#email').hasClass('is-valid') && $('#phone').hasClass('is-valid') && $('#age').hasClass('is-valid') && $('#password').hasClass('is-valid') && $('#repassword').hasClass('is-valid')) {
      $("#submitButton").prop("disabled", false);
    } else {
      $("#submitButton").prop("disabled", true);
    }
    });
    }


