const summary = new Map();
summary.set('billing', 'Monthly');
let billing = true;
const addOns = [];

const prices = new Map();
prices.set('Arcade', [9, 90]);
prices.set('Advanced', [12, 120]);
prices.set('Pro', [15, 150]);
prices.set('Online Service', [1, 10]);
prices.set('Larger Storage', [2, 20]);
prices.set('Customizable profile', [2, 20]);


const validity = [false, false, false, true];

const getNavButtons = document.getElementsByTagName('nav')[0].getElementsByTagName('button');
const disableBtns = boolean => {
    if(boolean) for(let btn = step + 1; btn < getNavButtons.length; btn++) getNavButtons[btn].disabled = true;
    else {
        for(let btn = step; btn < getNavButtons.length - 1; btn++) {
            if(validity[btn]) getNavButtons[btn + 1].disabled = false;
            else break;
        }
    }
}

const checkFirstStep = submit => {
    validity[0] = true;
    for(let input of document.getElementById('firstStep').getElementsByTagName('input')) {
        if(!input.validity.valid) {
            validity[0] = false;
            if(submit) {
                input.classList.add('invalid');
                input.parentElement.classList.add('active');
            }
        } else summary.set(input.name, input.value);
    }
    if(validity[0]) disableBtns(false);
    else disableBtns(true);
}

const checkSecondStep = submit => {
    for(let input of document.getElementById('secondStep').getElementsByTagName('input')) {
        if(input.name == 'plan' && input.validity.valid) {
            if(input.checked) summary.set('plan', input.value);
            validity[1] = true;
        };
    }
    if(!validity[1]) for(let input of document.getElementById('secondStep').getElementsByTagName('input')) if(input.name == 'plan') input.classList.add('invalid');
    if(validity[1]) disableBtns(false);
    else disableBtns(true);
}


for(let btn of getNavButtons) btn.addEventListener('click', (e) => changeStep(undefined, Number(e.target.innerText) - 1));

const steps = new Map();
steps.set(0, ['firstStep', checkFirstStep]);
steps.set(1, ['secondStep', checkSecondStep]);
steps.set(2, ['thirdStep', validity[2]]);
steps.set(3, ['lastStep', validity[3]]);
let step = 0;

let submitted;
const changeStep = (bottom, btn) => {
    if(submitted || btn == step) return;
    if(bottom && !validity[step]) {
        steps.get(step)[1](true);
        return;
    }
    if(btn > step && validity.slice(0, btn).includes(false)) return;
    const bottomNavigation = document.getElementsByClassName('bottomNavigation')[0];
    if((bottom && step == 2) || btn == 3) {
        document.getElementById('plan').innerText = `${summary.get('plan')} (${summary.get('billing')})`;
        document.getElementById('planPrice').innerText = `$${billing ? prices.get(summary.get('plan'))[0] + '/mo' : prices.get(summary.get('plan'))[1] + '/yr'}`;
        const summaryDiv = document.getElementsByClassName('summary')[0];
        let deleteDivs = false;
        let i = 0;
        while(true) {
            const val = summaryDiv.children[i];
            if(val.id == 'insertDivs') break;
            i++;
            if(deleteDivs) {
                val.remove();
                i--;
            } else if (val.id == 'ifAddOn') deleteDivs = true;
        }
        const hr = document.getElementById('ifAddOn');
        if(addOns.length) {
            hr.classList.add('active');
            const insert = document.getElementById('insertDivs');
            for(let addOn of addOns) {
                const div = document.createElement('div');
                const firstP = document.createElement('p');
                firstP.appendChild(document.createTextNode(addOn));
                const lastP = document.createElement('p');
                lastP.appendChild(document.createTextNode(billing ? '+$' + prices.get(addOn)[0] + '/mo' : '+$' + prices.get(addOn)[1] + '/yr'));
                div.appendChild(firstP);
                div.appendChild(lastP);
                summaryDiv.insertBefore(div, insert);
            }
        } else hr.classList.remove('active');
        document.getElementById('total').innerText = `Total (${billing ? 'per month' : 'per year'})`;
        let totalPrice = 0;
        totalPrice += billing ? prices.get(summary.get('plan'))[0] : prices.get(summary.get('plan'))[1];
        for(let addOn of addOns) totalPrice += billing ? prices.get(addOn)[0] : prices.get(addOn)[1];
        document.getElementById('totalPrice').innerText = `$${totalPrice}/${billing ? 'mo' : 'yr'}`;
        bottomNavigation.classList.add('active');
    } else bottomNavigation.classList.remove('active');
    getNavButtons[step].classList.remove('active');
    document.getElementById(steps.get(step)[0]).classList.remove('active');
    if(bottom != undefined) bottom ? step++ : step--;
    if(btn != undefined) btn < step ? step -= step - btn : step += btn - step;
    if(step == 2) {
        validity[step] = true;
        getNavButtons[3].disabled = false;
    }
    getNavButtons[step].classList.add('active');
    document.getElementById(steps.get(step)[0]).classList.add('active');
    step == 0 ? document.getElementById('goBackBtn').classList.add('inactive') : document.getElementById('goBackBtn').classList.remove('inactive');
}

const switchBilling = e => {
    document.getElementById('switchBilling').classList.toggle('active');
    for(let el of document.getElementsByClassName('billingChange')) el.classList.toggle('active');
    for(let el of document.getElementsByClassName('yearly')) el.classList.toggle('active');
    summary.set(e.target.name, e.target.value);
    billing = !billing;
}

const setValue = (e, arr) => {
    if(step == 0) checkFirstStep();
    if(step == 1) checkSecondStep();

    if(e.target.validity.valid && e.target.classList.contains('invalid')) {
        if(e.target.name == 'plan') {
            for(let input of document.getElementById('secondStep').getElementsByTagName('input')) {
                if(input.name == 'plan') input.classList.remove('invalid');
            }
        } else {
            e.target.classList.remove('invalid');
            e.target.parentElement.classList.remove('active');
        }
    }

    if(arr) {
        if(!addOns.includes(e.target.name)) {
            addOns.push(e.target.name);
            summary.set('addOns', addOns);
        } else {
            addOns.splice(addOns.indexOf(e.target.name), 1);
            summary.set('addOns', addOns);
        }
    }
}

const submit = () => {
    alert('Den Request Body findest du in der Console.');
    document.getElementById('lastStep').classList.remove('active');
    document.getElementById('submit').classList.add('active');
    document.getElementsByClassName('bottomNavigation')[0].style.display = 'none';
    submitted = true;
    console.log(summary);
}