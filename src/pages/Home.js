import React, {useState, useRef, useEffect} from 'react';
const LOCAL_STORAGE_KEY = 'todoList.home'
function Home(){
    //List of variables obtained from to do list
    const [date, setDate] = useState(new Date())
    const [wDate, setwDate] = useState(new Date())
    const todoTaskName = useRef(null)
    const todoDate = useRef(null);
    const todoLength = useRef(null);
    const [color, setColor] = useState('');
    const [tasks, setTasks] = useState([]);
    const [eventType, setType] = useState('');
    const [repeatType, setRepeat] = useState('Never');
    const endDate = useRef(null);




    //Checks if there is any local storage then renders the calendars
    useEffect(() =>{
        /*const storedTodos= JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        if(storedTodos)
            setTasks(storedTodos)*/
        renderCalendar();
        renderWeek();
    }, [])

    //Sorts the task list based on times
    useEffect(()=>{
        let resort = tasks
        setTasks(resort.sort(function(a,b){return a.end.getTime() - b.end.getTime()}))
        console.log(tasks)
        showList()

        //Saves information onto the local storage
        //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks))
    }, [tasks])

    //Checks if tasks need updating every second
    const [count, setCount] = useState(0);
    useEffect(() => {
        const interval = setInterval(function () {
            setCount(count + 1);
            for(let i = 0; i < tasks.length; i++){
                if(tasks[i].end.getTime() < Date.now() && tasks[i].end.getDate() !== new Date().getDate()){

                    tasks[i].delete = true
                }

                if(tasks[i].completed === false && tasks[i].end.getTime() < Date.now()){
                    tasks[i].completed = true;
                    console.log(tasks[i].completed)
                    showList()
                }
                if(tasks[i].delete === true){
                    //const newTasks = tasks.filter(task => task.delete === false)
                    //setTasks(newTasks)
                }
            }
        }, 1000);
        // return optional function for cleanup
        // in this case, this cleanup fn is called every time count changes
        return () => {

            clearInterval(interval);
        }
    }, [count]);

    //Functions to update calendar basd
    function prevMonth(){
        date.setMonth(date.getMonth() - 1);

        renderCalendar();
        const temp = new Date(date)
        setDate(temp)
    }
    function nextMonth(){
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
        const temp = new Date(date)
        setDate(temp)
    }
    function prevWeek(){
        wDate.setDate(wDate.getDate() - 1)
        renderWeek();
        const temp = new Date(wDate)
        setwDate(temp)
    }
    function nextWeek(){
        wDate.setDate(wDate.getDate() + 7)
        renderWeek();
        const temp = new Date(wDate)
        setwDate(temp)
    }


    //Swap the calendar using the swap button
    function swap(){
        document.querySelector(".calendar").style.display = "none";
        document.querySelector(".weekCalendar").style.display = "block";
        renderWeek();
    }
    function swapBack(){
        document.querySelector(".weekCalendar").style.display = "none";
        document.querySelector(".calendar").style.display = "block";
        date.setFullYear(wDate.getFullYear())
        date.setMonth(wDate.getMonth())
        date.setDate(1)
        renderCalendar();
        const temp = new Date(date)
        setDate(temp)
    }

    //Clicking the add button
    function clickModal(e){
        let modal = document.getElementById("myModal");
        modal.style.display = "block";
    }
    function unClickModal(e){
        let modal = document.getElementById("myModal");
        modal.style.display = "none";
    }

    //Show the day to day graph
    function showGraph(e){
        document.querySelector(".list").style.display = "none";
        document.querySelector(".graphic").style.display = "block";

        showGraphic();
    }
    function closeGraphic(e){
        document.querySelector(".list").style.display = "block";
        document.querySelector(".graphic").style.display = "none";
    }

    //Adds events in the todolist to the weekly calendar
    function addToWeek(initDate, endDate){
        const table = document.querySelectorAll(".weekCalendar > table > tbody > tr")
        for(let i = 2; i < table.length; i++){
            console.log(table[i].childElementCount)
            while(table[i].childElementCount > 1){
                table[i].removeChild(table[i].lastChild);
            }
        }
        for(let i = 0; i < tasks.length; i++){
            if(tasks[i].start > initDate && tasks[i].start < endDate && tasks[i].type === "Event"){
                console.log("goddamnit")
                for(let j = table[2 + tasks[i].start.getHours()].childElementCount - 1; j < tasks[i].start.getDay(); j++){
                        table[2 + tasks[i].start.getHours()].appendChild(document.createElement("td"))
                }
                let event = document.createElement("td")
                event.style.background = tasks[i].color
                event.innerText = tasks[i].name;
                table[2 + tasks[i].start.getHours()].appendChild(event);
                for(let k = 1; k < tasks[i].length; k++){
                    if(k + tasks[i].start.getHours() > 23 && tasks[i].start.getDay() +  1 !== endDate.getDay()){
                        for(let j = table[2 + (k + tasks[i].start.getHours()) % 24].childElementCount - 1; j < tasks[i].start.getDay() + 1; j++){
                            table[2 + (k + tasks[i].start.getHours()) % 24].appendChild(document.createElement("td"))
                        }
                    }
                    else {
                        for (let j = table[2 + k + tasks[i].start.getHours()].childElementCount - 1; j < tasks[i].start.getDay(); j++) {
                            table[2 + k + tasks[i].start.getHours()].appendChild(document.createElement("td"))
                        }
                    }
                    let eventBuffer = document.createElement("td")
                    eventBuffer.style.background = tasks[i].color
                    console.log(eventBuffer + "dsaoijfsd")
                    table[2 + (k + tasks[i].start.getHours()) % 24].appendChild(eventBuffer)
                }
            }
        }
    }


    //renders the calendar and all the dates for each month
    function renderCalendar(e){
        date.setDate(1);
        const monthDays = document.querySelector(".days");
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const firstDayIndex = date.getDay();
        const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
        const nextDays = 7 - lastDayIndex- 1;
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        document.querySelector(".date h1").innerHTML = months[date.getMonth()];
        document.querySelector(".date h1").innerHTML += " " + date.getFullYear();
        document.querySelector(".date p").innerHTML = new Date().toDateString();
        let days = "";
        for(let x = firstDayIndex; x > 0; x--){
            days += `<div class = "prev-date">${prevLastDay - x}</div>`;

        }
        for (let i = 1; i <= lastDay; i++) {
            if(i === new Date().getDate() && date.getMonth() === new Date().getMonth()){
                days += `<div class="today">${i}</div>`;
            } else{
                days += `<div class="day">${i}</div>`;
                monthDays.innerHTML = days;
            }
        }
        for(let j = 1; j <= nextDays; j++){
            days += `<div class = "next-date">${j}</div>`;
            monthDays.innerHTML = days;
        }
        let x = document.getElementsByClassName("day");
        for(let i = 0; i < x.length; i++){
            x[i].addEventListener("click", ()=>{
                document.querySelector(".calendar").style.display = "none";
                document.querySelector(".weekCalendar").style.display = "block";
                wDate.setFullYear(date.getFullYear())
                wDate.setMonth(date.getMonth())
                wDate.setDate(x[i].innerHTML)
                renderWeek();
                const temp = new Date(wDate)
                console.log(temp)
                setwDate(temp)
            });
        }
        document.querySelector(".wDate").addEventListener("click", ()=>{
            document.querySelector(".calendar").style.display = "none";
            document.querySelector(".weekCalendar").style.display = "block";
            wDate.setFullYear(date.getFullYear())
            wDate.setMonth(date.getMonth())
            wDate.setDate(document.querySelector(".today").innerHTML)
            renderWeek();
            const temp = new Date(wDate)
            setwDate(temp)
        });
        let y = document.getElementsByClassName("prev-date");
        for(let i = 0; i < y.length; i++){
            y[i].addEventListener("click", ()=>{
                document.querySelector(".calendar").style.display = "none";
                document.querySelector(".weekCalendar").style.display = "block";
                wDate.setFullYear(date.getFullYear())
                wDate.setMonth(date.getMonth() - 1)
                wDate.setDate(y[i].innerHTML)
                renderWeek();
                const temp = new Date(wDate)
                setwDate(temp)
            });
        }
        let z = document.getElementsByClassName("next-date");
        for(let i = 0; i < z.length; i++){
            z[i].addEventListener("click", ()=>{
                document.querySelector(".calendar").style.display = "none";
                document.querySelector(".weekCalendar").style.display = "block";
                wDate.setFullYear(date.getFullYear())
                wDate.setMonth(date.getMonth() + 1)
                wDate.setDate(z[i].innerHTML)
                renderWeek();
                const temp = new Date(wDate)
                setwDate(temp)
            });
        }

    };

    //Renders the weekly calendar
    function renderWeek(){
        const weekDays = document.querySelector(".weekDate");
        const lastDay = new Date(wDate.getFullYear(), wDate.getMonth() + 1, 0).getDate();
        let firstDayIndex = wDate.getDay();
        let lastDayIndex = new Date(wDate.getFullYear(), wDate.getMonth() + 1, 0).getDay();
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        document.querySelector(".wDate h1").innerHTML = months[wDate.getMonth()];
        document.querySelector(".wDate h1").innerHTML += " " + date.getFullYear();
        document.querySelector(".wDate p").innerHTML = new Date().toDateString();

        let days = "<th></th>";
        for (let i = 1; i <= lastDay; i++) {
            if(i === new Date().getDate()){
                firstDayIndex = new Date(wDate.getFullYear(), wDate.getMonth(), wDate.getDate() - wDate.getDay());
                lastDayIndex = new Date(wDate.getFullYear(), wDate.getMonth(), wDate.getDate()- wDate.getDay() + 7);
                break;
            }
        }
        document.querySelector(".weekLength").innerHTML = firstDayIndex.toDateString() + " - " + lastDayIndex.toDateString();
        console.log(wDate)
        let temp = new Date(firstDayIndex);
        while(temp.getDate() != lastDayIndex.getDate()){
            days += `<th>${temp.getDate()}</th>`
            temp = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate() + 1);
        }
        wDate.setFullYear(firstDayIndex.getFullYear())
        wDate.setMonth(firstDayIndex.getMonth())
        wDate.setDate(firstDayIndex.getDate())
        weekDays.innerHTML = days;
        console.log(wDate)
        addToWeek(firstDayIndex, new Date(lastDayIndex.getFullYear(), lastDayIndex.getMonth(), lastDayIndex.getDate() + 1))
    };


    //Adds an event or work to the task list
    function addList(e){
        let modal = document.getElementById("myModal");
        if(todoTaskName.current.value !=='' ){
            let save = todoTaskName.current.value
            const dateTime = new Date(todoDate.current.value);
            const duration = todoLength.current.value;
            let newDate = new Date(dateTime.getTime() + parseInt(duration) * 3600000);
            let repeatDate = dateTime;
            console.log(endDate.current.value)
            let end = new Date(endDate.current.value)
            let newTasks = tasks;
            if(endDate.current.value === ''){
                setTasks(prevTasks=>{
                    return [...prevTasks, {name: save, length: parseInt(duration), type: eventType, color: color, start: dateTime, end: newDate, completed: false, delete: false}]
                })
            }
            while(repeatDate.getTime() < end.getTime()){
                let repeat;
                let end;
                console.log("did this work")
                if(repeatType === "Daily"){
                    repeatDate.setDate(repeatDate.getDate() + 1)
                    newDate.setDate(newDate.getDate() + 1)
                }
                else if(repeatType ==="Weekly"){
                    repeatDate.setDate(repeatDate.getDate() + 7)
                    newDate.setDate(newDate.getDate() + 7)
                }
                else if(repeatType === "Monthly"){
                    repeatDate.setMonth(repeatDate.getMonth() + 1)
                    newDate.setDate(newDate.getMonth() + 1)
                }
                else if(repeatType === "Yearly"){
                    repeatDate.setFullYear(repeatDate.getFullYear() + 1)
                    newDate.setFullYear(newDate.getFullYear() + 1)
                }
                else
                    setTasks(prevTasks=>{
                        return [...prevTasks, {name: save, length: parseInt(duration), type: eventType, color: color, start: dateTime, end: newDate, completed: false, delete: false}]
                    })
                repeat = new Date(repeatDate);
                end = new Date(newDate)
                newTasks.push({name: save, length: parseInt(duration), type: eventType, color: color, start: repeat, end: end, completed: false, delete: false})
            }
            console.log(newTasks)
            if(tasks.length !== newTasks.length){
                console.log("what")
                setTasks(newTasks)
            }
            modal.style.display = "none";
        }
        todoDate.current.value = null;
        todoLength.current.value = null;
        todoTaskName.current.value = null;
        setColor('')
        setType('')

        showList()
    }

    //Shows all events in the list and gives buttons to move/remove them
    function showList(e){
        const Completed = document.querySelector(".Completed");
        while(Completed.childElementCount > 1){
            Completed.removeChild(Completed.lastChild);
        }
        const notCompleted = document.querySelector(".notCompleted");
        while(notCompleted.childElementCount > 1){
                notCompleted.removeChild(notCompleted.lastChild);
        }
        for(let i = 0; i < tasks.length; i++){
            const newTask = document.createElement("li");
            newTask.textContent = tasks[i].name;
            newTask.style.background = tasks[i].color;
            const start = tasks[i].start;
            newTask.textContent += start.toLocaleString() + " - ";
            const end = tasks[i].end;
            newTask.textContent += end.toLocaleString();
            console.log("type " + tasks[i].type)
            if(tasks[i].type === "Work"){
                console.log("asdofijasdofijf")
                const checkBtn = document.createElement("button");
                const delBtn = document.createElement("button");
                const undoBtn = document.createElement("button");
                checkBtn.innerHTML = '<i class="fa fa-check"></i>'
                delBtn.innerHTML = '<i class="fa fa-trash"></i>'
                undoBtn.innerHTML = '<i class="fa fa-undo"></i>'
                newTask.appendChild(delBtn);
                newTask.appendChild(checkBtn);
                checkBtn.addEventListener("click", function(){
                    const parent = this.parentNode;
                    parent.remove();
                    Completed.appendChild(parent);
                    checkBtn.remove();
                    parent.appendChild(undoBtn);
                });
                delBtn.addEventListener("click", function(){
                    const parent = this.parentNode;
                    parent.remove();
                    tasks[i].delete = true;
                    console.log(tasks)
                });
                undoBtn.addEventListener("click", function(){
                    const parent = this.parentNode;
                    parent.remove();
                    notCompleted.appendChild(parent);
                    undoBtn.remove();
                    parent.appendChild(checkBtn);
                })
            }
            if(tasks[i].type === "Event"){
                const delBtn = document.createElement("button");
                delBtn.innerHTML = '<i class="fa fa-trash"></i>'
                newTask.appendChild(delBtn);
                delBtn.addEventListener("click", function(){
                    const parent = this.parentNode;
                    parent.remove();
                    tasks[i].delete = true;
                    console.log(tasks)
                });
            }
            if(tasks[i].completed === false){
                notCompleted.appendChild(newTask);
            }
            else{

                Completed.appendChild(newTask);
            }
        }
    }

    //Actually shows the day to day work length
    function showGraphic(e){
        const graphic = document.querySelector(".graphic");
        while(graphic.firstChild){
            graphic.removeChild(graphic.firstChild);
        }
        const btn = document.createElement("button");
        btn.innerText = "Visual"
        btn.id = "retGraphic";
        btn.addEventListener("click", function(){
            closeGraphic();
        });
        graphic.appendChild(btn);
        for(let i = 0; i < tasks.length; i++){
            console.log(tasks[i]);
            let value = document.createElement("li");
            value.innerHTML = tasks[i].name;
            console.log(tasks[i].name);
            value.style.height = tasks[i].length*100/24 + "%";
            console.log(tasks[i].length*100/24 + "%");
            value.style.background = tasks[i].color;
            document.querySelector(".graphic").appendChild(value);
        }
    }
    //Returns all the general html of the project
        return (
                    <div className="container">
                        <div className="leftHalf">
                            <div className="calendar">
                                <div className="swap">
                                    <button onClick={swap} id="swapCal">Week</button>
                                </div>
                                <div className="month">
                                    <i onClick={prevMonth} className="fas fa-angle-left prev"></i>
                                    <div className="date">
                                        <h1></h1>
                                        <p></p>
                                    </div>
                                    <i onClick={nextMonth}className="fas fa-angle-right next"></i>
                                </div>
                                <div className="weekdays">
                                    <div>Sun</div>
                                    <div>Mon</div>
                                    <div>Tue</div>
                                    <div>Wed</div>
                                    <div>Thu</div>
                                    <div>Fri</div>
                                    <div>Sat</div>
                                </div>
                                <div className="days"></div>
                            </div>
                            <div className="weekCalendar">
                                <div className="swapBack">
                                    <button onClick={swapBack} id="swapCal">Month</button>
                                </div>
                                <div className="week">
                                    <i onClick={prevWeek} className="fas fa-angle-left prev"></i>
                                    <div className="wDate">
                                        <h1></h1>
                                        <p></p>
                                        <p className="weekLength"></p>
                                    </div>
                                    <i onClick={nextWeek} className="fas fa-angle-right next"></i>
                                </div>
                                <table>
                                    <tbody>
                                    <tr>
                                        <th></th>
                                        <th>Sun</th>
                                        <th>Mon</th>
                                        <th>Tues</th>
                                        <th>Wed</th>
                                        <th>Thu</th>
                                        <th>Fri</th>
                                        <th>Sat</th>
                                    </tr>
                                    <tr className="weekDate">
                                    </tr>
                                    <tr>
                                        <td>12:00 AM</td>
                                    </tr>
                                    <tr>
                                        <td>1:00 AM</td>
                                    </tr>
                                    <tr>
                                        <td>2:00 AM</td>
                                    </tr>
                                    <tr>
                                        <td>3:00 AM</td>
                                    </tr>
                                    <tr>
                                        <td>4:00 AM</td>
                                    </tr>
                                    <tr>
                                        <td>5:00 AM</td>
                                    </tr>
                                    <tr>
                                        <td>6:00 AM</td>
                                    </tr>
                                    <tr>
                                        <td>7:00 AM</td>
                                    </tr>
                                    <tr>
                                        <td>8:00 AM</td>
                                    </tr>
                                    <tr>
                                        <td>9:00 AM</td>
                                    </tr>
                                    <tr>
                                        <td>10:00 AM</td>
                                    </tr>
                                    <tr>
                                        <td>11:00 AM</td>
                                    </tr>
                                    <tr>
                                        <td>12:00 PM</td>
                                    </tr>
                                    <tr>
                                        <td>1:00 PM</td>
                                    </tr>
                                    <tr>
                                        <td>2:00 PM</td>
                                    </tr>
                                    <tr>
                                        <td>3:00 PM</td>
                                    </tr>
                                    <tr>
                                        <td>4:00 PM</td>
                                    </tr>
                                    <tr>
                                        <td>5:00 PM</td>
                                    </tr>
                                    <tr>
                                        <td>6:00 PM</td>
                                    </tr>
                                    <tr>
                                        <td>7:00 PM</td>
                                    </tr>
                                    <tr>
                                        <td>8:00 PM</td>
                                    </tr>
                                    <tr>
                                        <td>9:00 PM</td>
                                    </tr>
                                    <tr>
                                        <td>10:00 PM</td>
                                    </tr>
                                    <tr>
                                        <td>11:00 PM</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="rightHalf">

                            <div className="list">
                                <div className="addTask">
                                    <button onClick={clickModal}id="modalBtn">Add</button>
                                    <button onClick={showGraph} id="graphic">Visual</button>
                                    <div id="myModal" className="modal">
                                        <div className="modal-content">
                                            <span onClick={unClickModal} className="close">&times;</span>
                                            <p>Add your new task here</p>
                                            <div className="taskName">
                                                <input type="text" ref={todoTaskName} className="taskNameAdd" placeholder="Name of task"/>
                                            </div>
                                            <div className="basics">
                                                <div onChange={event => setType(event.target.value)} className="eventType">
                                                    <input type="radio" checked = {eventType === "Event"} name="eventType" value="Event"/><label
                                                    htmlFor="Event">Event</label>
                                                    <input type="radio" checked = {eventType === "Work"} name="eventType" value="Work"/><label
                                                    htmlFor="Event">Work</label>
                                                </div>
                                                <label htmlFor="dateTime">Date</label><input ref={todoDate} type="datetime-local" className="dateTime"/>
                                                <label htmlFor="length">Length</label><input type="number" ref={todoLength} className="length"/>
                                            </div>
                                            <div className="repeats">
                                                <label htmlFor="repeat">Repeats</label>
                                                <select onChange={event => setRepeat(event.target.value)}className="repeats">
                                                    <option value="Never">Never</option>
                                                    <option value="Daily">Once a day</option>
                                                    <option value="Weekly">Once a week</option>
                                                    <option value="Monthly">Once a month</option>
                                                    <option value="Yearly">Once a year</option>
                                                </select>

                                                <label  htmlFor="date">Repeat until what date</label><input ref={endDate} type="date"
                                                                                                           className="repeatDate"/>
                                            </div>
                                            <div className="description">
                                                <input type="text" placeholder="Add description"/>
                                            </div>
                                            <div onChange={event => setColor(event.target.value)} className="color">
                                                <input type="radio" checked = {color === 'Red'} name="color" value="Red"/><label
                                                htmlFor="Red">Red</label>
                                                <input type="radio" checked = {color === 'Blue'}name="color" value="Blue"/><label
                                                htmlFor="Blue">Blue</label>
                                                <input type="radio" checked = {color === 'Green'}name="color" value="Green"/><label
                                                htmlFor="Green">Green</label>
                                                <input type="radio" checked = {color === 'Yellow'}name="color" value="Yellow"/><label
                                                htmlFor="Yellow">Yellow</label>
                                                <input type="radio"checked = {color === 'Purple'}name="color" value="Purple"/><label
                                                htmlFor="Purple">Purple</label>
                                                <input type="radio" checked = {color === 'Orange'}name="color" value="Orange"/><label
                                                htmlFor="Orange">Orange</label>
                                                <input type="radio" checked = {color === 'Pink'}name="color" value="Pink"/><label
                                                htmlFor="Pink">Pink</label>
                                                <input type="radio" checked = {color ==='Turquoise'}name="color" value="Turquoise"/><label
                                                htmlFor="Turqoise">Turquoise</label>
                                            </div>
                                            <button onClick={addList} id="addBtn">Add</button>
                                        </div>

                                    </div>
                                </div>
                                <ol className="notCompleted">
                                    <h3>Not Completed</h3>
                                </ol>
                                <ol className="Completed">
                                    <h3>Completed</h3>
                                </ol>
                            </div>
                            <div className="graphic">
                                <button onClick={closeGraphic}id="retGraphic">Visual</button>
                            </div>
                        </div>
                    </div>
        );
}
export default Home;