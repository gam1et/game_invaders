$(document).ready(function(){
    var _ = {
        idElem: 'app', // id элемента, внутри которого все создается
        countInvaders: 2,
        lvl: 1,
        kills: 0,
        genElem: '', // элемент, к которому будут обращаться по _.idElem
        playerName: '',
        updInfo: function(){
            var newLvlCheck = false; // нужно чтобы повышение уровня и сообщение об этом не повторялись каждую секунду на количестве kills кратных 10
            if(_.kills%10==0 && _.kills!=0 && _.newLvlCheck==false){
                _.countInvaders += 2;
                _.lvl += 1;
                _.titleInfo('New level!');
                _.newLvlCheck = true;
            }
            if( !(_.kills%10==0 && _.kills!=0) ){
                _.newLvlCheck = false;
            }
            $(lvlCounter).text('Level: '+_.lvl+'');
            $(killCounter).text('Kills: '+_.kills+'');
        },
        titleInfo: function(text){ // инфо по центру экрана во время боя
            var title = document.createElement('div');
            $(title).attr('id','titleInfo').text(text).css({
                textAlign:'center',
                fontSize:24,
                color:'#0ecb13'
            });
            $(_.genElem).append(title);
            $(title).animate({zoom:3,opacity:0},3000);
            setTimeout(function(){$(title).remove();},3000); // удаляем из памяти
        },
        loser:function(){
            document.body.removeChild(_.genElem);

            var opinion;

            var blockInfo = document.createElement('div');
            blockInfo.style.padding = '10px 20px';

            var headInfo = document.createElement('h2');
            headInfo.innerText = 'YOU LOSE!';
            headInfo.style.color = '#fff';

            var staticInfo = document.createElement('div');
            if(_.kills==0){
                opinion = 'You looser';
            }
            else if(_.kills>0 && _.kills<10){
                opinion = 'Not bad';
            }
            else{
                opinion = 'Good job';
            }
            console.log(_.kills);

            staticInfo.innerText = `Soldier ${_.playerName}!
            You killed ${_.kills} invaders! ${opinion}`;

            var btnInfo = document.createElement('p');
            btnInfo.innerText = 'Replay';
            btnInfo.style.color = '#fff';
            btnInfo.style.cursor = 'pointer';
            btnInfo.setAttribute('onclick','location.reload();');

            blockInfo.appendChild(headInfo);
            blockInfo.appendChild(staticInfo);
            blockInfo.appendChild(btnInfo);
            document.body.appendChild(blockInfo);
        },
        game:function(){
            
            // объявляем переменные интерфейса
            var timer = document.createElement('div');
            $(timer).text('0').css({padding:'5px'});
            setInterval(function(){
                var val =  $(timer).text();
                $(timer).text(+val+1);
                _.updInfo(); // проверка на новый уровень
            },1000)

            $(_.genElem).css({
                height:window.innerHeight,
                margin:'0',
                padding:'0',
                background:'#000',
                overflow:'hidden',
                position:'relative'
            })
            
            $(_.genElem).css({
                background: 'url(bg.jpg) repeat-x',
                '-webkit-animation':'slide 1s linear infinite'
            })
            _.genElem.appendChild(timer);
            _.genElem.appendChild(lvlCounter);  
            _.genElem.appendChild(killCounter);    

            // корабль игрока
            var ship = document.createElement('div');
            $(ship).attr('id','ship').css({
                width:'60px',
                height:'53px',
                background:'url(ship.png) no-repeat',
                position:'absolute',
                bottom:'5px',
                left:'45%',
                zIndex:'1'
            });
            // выстрел игрока
            var shipShoot = document.createElement('div');
            $(shipShoot).attr('id','shipShoot').css({
                width:'24px',
                height:'1000px',
                background:'url(laser.png) no-repeat',
                position:'absolute',
                left:'50%',
                display:'none'
            });
            $(ship).append(shipShoot);
            
            $(_.genElem).append(ship); 
            $('body').bind('keydown',function(e){
                var posShipLeft = $(ship).offset().left,
                    posShipTop = $(ship).offset().top;
                if(e.which==37){ // влево
                    $(ship).css({left:posShipLeft-15});
                }
                if(e.which==39){ // вправо
                    $(ship).css({left:posShipLeft+15});
                }
                if(e.which==32){ // выстрел
                    shipShoot= $(shipShoot).detach().css({left:posShipLeft+24,bottom:30});
                    $(_.genElem).append(shipShoot);
                    $('.inv').each(function(i,inv){
                        var invPosLeft = $(inv).css('left').replace('px','');
                        var invPosTop = $(inv).css('top').replace('px','');
                        var shipShootPosLeft = $(shipShoot).css('left').replace('px','');
                        if( (shipShootPosLeft+20 >= invPosLeft && shipShootPosLeft-20 <= invPosLeft) && posShipTop>invPosTop  ){ // если противник входит в диапазон луча и не ниже позиции корабля
                            $(inv).css({
                                width:'50px',
                                height:'54px',
                                background:'url(expl.png) no-repeat',
                                transition:'1s'
                            });
                            setTimeout(function(){$(inv).remove()},500);
                            _.kills += 1;
                            _.updInfo;
                        }
                    })
                    $(shipShoot).show().fadeOut(500); // визуализация выстрела
                }
            })

            setInterval(function(){
                for(var i = 0; i<_.countInvaders; i++){
                    var invader = document.createElement('div'),
                        speed =  Math.round(Math.random()*(7000-3000)+4000), // скорость инведеров
                        min = 0, max = window.innerWidth,
                        posY = Math.round(Math.random()*(max-min)+min);
                    $(invader).css({width:'24px',height:'17px',background:'url(invader.png)',position:'absolute',top:-40,left:posY}).addClass('inv');
                    $(_.genElem).append(invader);
                    $(invader).animate({top:window.innerHeight}, speed);
                    setTimeout(function(){ // удаляем элемент захватчика из DOM
                        $(invader).remove();
                    },5000)
                }

                $('.inv').one('mouseover',function(){
                    _.loser();
                })
            },3000);
        },
        init: function(){
            var genElem = document.getElementById(_.idElem);
            _.genElem = genElem;
            _.welcome();
        },
        welcome:function(){
            var input = document.createElement('input'),
                label = document.createElement('h2'),
                block = document.createElement('div'),
                confirm = document.createElement('button');
            $(input).css({
                color:'#0be400',
                backgroundColor:'#333',
                margin: '0 auto',
                display: 'block',
                fontSize: '24px',
                fontWeight: 700,
                outline:'none',
                border: 0,
                padding: 10
            });
            $(label).css({
                color:'#0be400',
                textAlign:'center'
            }).text('What`s your name, soldier?');
            $(confirm).css({
                display:'none',
                color:'#0be400',
                fontSize: '24px',
                fontWeight: 700,
                outline:'none',
                border: 0,
                cursor:'pointer',
                padding:'10px',
                margin:'10px auto 0 auto',
                backgroundColor:'#333'
            }).text('Confirm!');
            $(block).append(label,input,confirm);
            $(_.genElem).append(block);
            $(input).focus();

            $(document).on('input',input,function(){
                var val = $(input).val();
                if(val.length>1){
                     $(confirm).css({display:'block'});
                }else{
                    $(confirm).hide();
                }
            })
            $(input).keypress(function(e){ // принимаем имя по нажатию enter
                if(e.which==13) $(confirm).trigger('click');
            })
            $(confirm).click(function(){
                _.playerName = $(input).val();
                _.game();
                $(block).remove();
            });
        }
    }

    var lvlCounter = document.createElement('div');
    $(lvlCounter).text('Level: '+_.lvl).css({padding:'5px'});

    var killCounter = document.createElement('div');
    $(killCounter).text('Kills: '+_.kills).css({padding:'5px'});

    //_.game(); // запуск игры
    _.init();
})
