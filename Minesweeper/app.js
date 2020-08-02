document.addEventListener('DOMContentLoaded',()=>{

    const grid=document.querySelector('.grid')
    let width = 10
    let squares = []
    let bombAmount=20
    let isGameOver=false
    let flags=bombAmount
    let win=false
    let resetbutton=document.querySelector('#reset')
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width*width-bombAmount).fill('valid')


    const gamesArray=emptyArray.concat(bombsArray)
    console.log(gamesArray)
    const shuffledArray=shuffle(gamesArray)
    console.log(shuffledArray)
    console.log('called')
    //create board
    function createBoard()
    {

        //Put random bombs
        // const bombsArray = Array(bombAmount).fill('bomb')
      

        for(let i=0;i<width*width;i++)
        {
            const square= document.createElement('div')
            square.setAttribute('id',i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            //add onclick event listener
            square.addEventListener('click',function(e){
                click(square)
            })

            square.oncontextmenu = function(e)
            {
                e.preventDefault()
                addflag(square)
            }
        }

        //add numbers

        for(let i=0;i<squares.length;i++)
        {
            let total=0
            const isLeftEdge = (i% width===0)
            const isRightEdge= (i%width ===width-1)

            if(squares[i].classList.contains('valid'))
            {
                if(i>0 && !isLeftEdge && squares[i-1].classList.contains('bomb'))total++;
                if(i<99 && !isRightEdge && squares[i+1].classList.contains('bomb'))total++;
                if(i>9 && !isRightEdge && squares[i+1-width].classList.contains('bomb'))total++;
                if(i<90 && !isRightEdge && squares[i+1+width].classList.contains('bomb'))total++;
                if(i>9 && !isLeftEdge && squares[i-1-width].classList.contains('bomb'))total++;
                if(i<90 && !isLeftEdge && squares[i-1+width].classList.contains('bomb'))total++;
                if(i>9 && squares[i-width].classList.contains('bomb'))total++;
                if(i<90 && squares[i+width].classList.contains('bomb'))total++;
                squares[i].setAttribute('data',total)

            }
        }
    }

    resetbutton.addEventListener('click',function(e){
        resetpressed(gamesArray)
    })

    //Function to shuffle array
    function shuffle(array)
    {
        let currentIndex=array.length-1,tempValue,randomIdx;
        // debugger;
        while(currentIndex !== 0)
        {
            randomIdx=Math.floor(Math.random()*currentIndex)

            tempValue=array[currentIndex]
            array[currentIndex]=array[randomIdx]
            array[randomIdx]=tempValue
            currentIndex--;


        }
        return array
    }

    function click(square)
    {
       
        if(isGameOver || win) return
        if(square.classList.contains('checked') || square.classList.contains('flag'))return
        if(square.classList.contains('bomb'))
        {
            gameover(square)
        }
        else
        {
            let total=square.getAttribute('data')
            if(total!=0)
            {
                square.classList.add('checked')
                square.classList.add('number')
                square.innerHTML= total
                return
            }
            checksquare(square)

        }
        square.classList.add('checked')

    }

    //check neigbouring squares
    function checksquare(square)
    {
        let currentID=square.id
        const isLeftEdge= (currentID%10===0)
        const isRightEdge= (currentID%10===width-1)

        setTimeout(()=>{
            if(currentID>0 && !isLeftEdge)
            {
                const newID=squares[parseInt(currentID)-1].id
                const newSquare=document.getElementById(newID)
                click(newSquare)
            }
            if(currentID<99 && !isRightEdge)
            {
                const newID=squares[parseInt(currentID)+1].id
                const newSquare=document.getElementById(newID)  
                click(newSquare)
            }
            if(currentID>9 && !isRightEdge )
            {
                const newID=squares[parseInt(currentID)+1-width].id
                const newSquare=document.getElementById(newID)
                click(newSquare)
            }
            if(currentID<90 && !isRightEdge )
            {
                const newID=squares[parseInt(currentID)+1+width].id
                const newSquare=document.getElementById(newID)
                click(newSquare)
            }
            if(currentID>9 && !isLeftEdge )
            {
                const newID=squares[parseInt(currentID)-1-width].id
                const newSquare=document.getElementById(newID)
                click(newSquare)
            }
            if(currentID<90 && !isLeftEdge )
            {
                const newID=squares[parseInt(currentID)-1+width].id
                const newSquare=document.getElementById(newID)
                click(newSquare)
            }
            if(currentID>9)
            {
                const newID=squares[parseInt(currentID)-width].id
                const newSquare=document.getElementById(newID)
                click(newSquare)
            }
            if(currentID<90)
            {
                const newID=squares[parseInt(currentID)+width].id
                const newSquare=document.getElementById(newID)
                click(newSquare)
            }
        },10)

    }

    function gameover(square)
    {
        console.log("BOOM! Game Over")
        isGameOver=true

        //show all the bomb locations
        squares.forEach(square=>{
            if(square.classList.contains('bomb'))
            {
                square.innerHTML='💣'
                
                square.classList.add('bombafterGameOver')
            }
        })
    }

    //adding flags

    function addflag(square)
    {
        if(isGameOver || win)return
        if(!square.classList.contains('checked') && flags>0)
        {
            if(!square.classList.contains('flag'))
            {
                square.classList.add('flag')
                square.innerHTML='🚩'
                flags--
                checkforwin()

            }
            else {
                square.classList.remove('flag')
                 flag++
                 square.innerHTML=''
                }
        }

    }

    //check for win

    function checkforwin()
    {
        let matches=0
        for(let i=0;i<squares.length;i++)
        {
            if(squares[i].classList.contains('bomb') && squares[i].classList.contains('flag'))
            {
                matches++
            }
            if(matches===bombAmount)
            {
                console.log('You Won')
                win=true
                break
            }

        }
    }

    function resetpressed(array)
    {
        // let temp=document.querySelector('.grid')
        let i=0
        array=shuffle(array)

        for(let i=0;i<width*width;i++)
        {
            squares[i].classList.remove("bomb","valid","bombafterGameOver","checked","number")
            
            // squares[i].getAttribute("innerHTML"),remove()
        }
        // let abc=document.getElementById('id')
        squares.forEach(square=>{
           
                square.innerHTML=''
                // abc.remove()
        })
        for(let i=0;i<width*width;i++)
        {
            squares[i].setAttribute('id',i)
            squares[i].classList.add(array[i])
            // const square = document.createElement('div')
            // square.setAttribute('id',i)

            squares[i].addEventListener('click',function(e){
                click()
            })
    
            squares[i].oncontextmenu = function(e)
            {
                e.preventDefault()
                addflag()
            }
        console.log(squares[i]+ " "+squares[i].getAttribute('id'))

        }
        isGameOver=false;
        win=false;
        
        
        

    }
    createBoard()
})