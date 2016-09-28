var app=angular.module('app',[]);

app.controller('myCtrl',function($scope,$interval,$timeout){
    $scope.eyetrainingswitch1=true;
    $scope.eyetrainingswitch2=false;

    $scope.switcheyetraining=function(value){
        $scope.eyetrainingswitch1=value;
        $scope.eyetrainingswitch2=!value;
    }

    //evetraining app
    //like blackjack,initiate the game references
    var eyetraningcard1show={};
    var eyetraningcard2show={};
    var eyetraningcard3show={};

    var eyetraningcard1number=0;
    var eyetraningcard2number=0;
    var eyetraningcard3number=0;

    var movingcard1=document.getElementById('movingcard1');
    var movingcard2=document.getElementById('movingcard2');
    var movingcard3=document.getElementById('movingcard3');

    var cardArr=[];
    for(var i=1,j=1,k=0;i<53;i++){
        var tmp={num:j,src:"images/"+i+".jpg"};
        if(j==10){
            if(k==3){
                k=-1;
                j=1;
            }
            k++;
        }else{
           j++;
        }
        cardArr.push(tmp);
    }
    
    //randomly pick three cards and set one of them as our target card.
    $scope.eyetraining_getcards=function(){
        do{
            eyetraningcard1number=Math.ceil(Math.random()*52);
            eyetraningcard2number=Math.ceil(Math.random()*52);
            eyetraningcard3number=Math.ceil(Math.random()*52);

            var tmparr=[eyetraningcard1number,eyetraningcard2number,eyetraningcard3number];
        }while(filtersame(tmparr))
       
        $scope.eyetrainingcard1={num:cardArr[eyetraningcard1number].num,src:cardArr[eyetraningcard1number].src};
        $scope.eyetrainingcard2={num:cardArr[eyetraningcard2number].num,src:cardArr[eyetraningcard2number].src};
        $scope.eyetrainingcard3={num:cardArr[eyetraningcard3number].num,src:cardArr[eyetraningcard3number].src};

        var decide_target=Math.ceil(Math.random()*3);
        if(decide_target==1){
            $scope.eyetrainingtargetcard={num:cardArr[eyetraningcard1number].num,src:cardArr[eyetraningcard1number].src};
        }
        if(decide_target==2){
            $scope.eyetrainingtargetcard={num:cardArr[eyetraningcard2number].num,src:cardArr[eyetraningcard2number].src};
        }
        if(decide_target==3){
            $scope.eyetrainingtargetcard={num:cardArr[eyetraningcard3number].num,src:cardArr[eyetraningcard3number].src};
        }
        movingcard1.style.left="150px";
        movingcard2.style.left="400px";
        movingcard3.style.left="650px";

        movingcard1.style.transition="ease-out 0.3s";
        movingcard2.style.transition="ease-out 0.3s";
        movingcard3.style.transition="ease-out 0.3s";
    };
    
    //only we press ready button can we start move cards.
    var eyetrainingreday=false; 
    //only after cards moving ends can we pick the card we think it is target card.
    var chooserightcard=false;
    
    //turn cards back
    $scope.eyetraining_ready=function(){
        $scope.eyetrainingcard1.src="images/55.jpg";
        $scope.eyetrainingcard2.src="images/55.jpg";
        $scope.eyetrainingcard3.src="images/55.jpg";
        eyetrainingreday=true;
    }

    var intervalstart=false; 

    //when click move button, interval function begin work, and delay close using time out function.
    $scope.movingcards=function(){
        if(eyetrainingreday){
            intervalstart=true;
            var moving_time=5000+Math.ceil(Math.random()*3000);
            $timeout(function(){
                intervalstart=false;
                chooserightcard=true; 
            },moving_time);
        }
    }

    function filtersame(arr){
        for(var i=0;i<arr.length;i++){
            for(var j=i+1;j<arr.length;j++){
                if(arr[j]==arr[i]){
                    return true;
                }
            }
        }
        return false;
    }

    $interval(function(){
        if(intervalstart){
            var moving_objects=Math.ceil(Math.random()*3);
            console.log("moving_objects: "+moving_objects);
            movingProcessing(moving_objects);
        }
    },1000);
    
    /*there are three moving card patterns in all,which are swap 1 and 2,
    1 and 3, 2 and 3*/
    function movingProcessing(way){
        switch(way){
            case 1:
               swapCards(1,2);
               break;
            case 2:
               swapCards(1,3);
               break;
            case 3:
               swapCards(2,3);
               break;
            default:
               break;
        }
    };
    
    //change cards position function
    function swapCards(a,b){
       updateCards();
       if(a==1&&b==2){
            $timeout(function(){updateArr[0].style.left="400px"},300);
            updateArr[1].style.left="150px";
       }
       if(a==1&&b==3){
            $timeout(function(){updateArr[0].style.left="650px"},300);
            updateArr[2].style.left="150px";
       }
       if(a==2&&b==3){
            $timeout(function(){updateArr[1].style.left="650px"},300);
            updateArr[2].style.left="400px";
       }
    }
    //use an update array to restore each round's swap result.
    var updateArr=[];
    
    //get updated array using tricky method
    function updateCards(){
        var dummyArr=[movingcard1,movingcard2,movingcard3,movingcard1,movingcard2,movingcard3,movingcard1,movingcard2,movingcard3];
        updateArr=[];
        var update1=true;
        var update2=false;
        var update3=false;

        for(var z=0;z<9;z++){
            if(update1){
                if(dummyArr[z].style.left=="150px"){
                    updateArr.push(dummyArr[z]);
                    update1=false;
                    update2=true;
                }
            }
            if(update2){
                if(dummyArr[z].style.left=="400px"){
                    updateArr.push(dummyArr[z]);
                    update2=false;
                    update3=true;
                }
            }
            if(update3){
                if(dummyArr[z].style.left=="650px"){
                    updateArr.push(dummyArr[z]);
                    update3=false;
                }
            }
        }
        console.log(updateArr);
        return updateArr;
    }
    
    //after moving cards, the different result we pick one of three cards.
    $scope.choosecard1=function(){
        if(chooserightcard){
            movingcard1.style.border="5px solid red";
            $scope.eyetrainingcard1={num:cardArr[eyetraningcard1number].num,src:cardArr[eyetraningcard1number].src};
            $scope.eyetrainingcard2={num:cardArr[eyetraningcard2number].num,src:cardArr[eyetraningcard2number].src};
            $scope.eyetrainingcard3={num:cardArr[eyetraningcard3number].num,src:cardArr[eyetraningcard3number].src};
            chooserightcard=false;

            if($scope.eyetrainingcard1.num==$scope.eyetrainingtargetcard.num){
                $scope.getrightcard=true;
                console.log($scope.getrightcard);
            }else{
                $scope.getwrongcard=true;
            }
        }
    }

    $scope.choosecard2=function(){
        if(chooserightcard){
            movingcard2.style.border="5px solid red";
            $scope.eyetrainingcard1={num:cardArr[eyetraningcard1number].num,src:cardArr[eyetraningcard1number].src};
            $scope.eyetrainingcard2={num:cardArr[eyetraningcard2number].num,src:cardArr[eyetraningcard2number].src};
            $scope.eyetrainingcard3={num:cardArr[eyetraningcard3number].num,src:cardArr[eyetraningcard3number].src};
            chooserightcard=false;

            if($scope.eyetrainingcard2.num==$scope.eyetrainingtargetcard.num){
                $scope.getrightcard=true;
                console.log($scope.getrightcard);
            }else{
                $scope.getwrongcard=true;
            }
        }
    }

    $scope.choosecard3=function(){
        if(chooserightcard){
            movingcard3.style.border="5px solid red";
            $scope.eyetrainingcard1={num:cardArr[eyetraningcard1number].num,src:cardArr[eyetraningcard1number].src};
            $scope.eyetrainingcard2={num:cardArr[eyetraningcard2number].num,src:cardArr[eyetraningcard2number].src};
            $scope.eyetrainingcard3={num:cardArr[eyetraningcard3number].num,src:cardArr[eyetraningcard3number].src};
            chooserightcard=false;

            if($scope.eyetrainingcard3.num==$scope.eyetrainingtargetcard.num){
                $scope.getrightcard=true;
                console.log($scope.getrightcard);
            }else{
                $scope.getwrongcard=true;
            }
        }
    }
    
    //reset game
    $scope.eyetrainingreset=function(){
        eyetraningcard1show={};
        eyetraningcard2show={};
        eyetraningcard3show={};
        $scope.eyetrainingcard1=null;
        $scope.eyetrainingcard2=null;
        $scope.eyetrainingcard3=null;
        $scope.eyetrainingtargetcard=null;
        eyetrainingreday=false;
        intervalstart=false;
        chooserightcard=false;
        $scope.getrightcard=false;
        $scope.getwrongcard=false;
        movingcard1.style.border="5px solid white";
        movingcard2.style.border="5px solid white";
        movingcard3.style.border="5px solid white";
    };
})