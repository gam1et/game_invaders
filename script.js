$(document).ready(function(){
    var _ = {
        countInvaders: 2,
        lvl: 1,
        kills: 0,
        updInfo: function(){
            var time = $(timer).text();
            if(_.kills%10==0 && _.kills!=0){
                _.countInvaders += 2;
                _.lvl += 1;
                _.titleInfo('New level!');
            }
            $(lvlCounter).text('Level: '+_.lvl+'');
            $(killCounter).text('Kills: '+_.kills+'');
        },
        titleInfo: function(text){ // инфо по центру экрана
            var title = document.createElement('div');
            $(title).attr('id','titleInfo').text(text).css({
                textAlign:'center',
                fontSize:24,
                color:'#0ecb13'
            });
            $('#app').append(title);
            $(title).animate({zoom:3,opacity:0},3000);
            setTimeout(function(){$(title).remove();},3000); // удаляем из памяти
        },
        loser:function(){
            $('#app').remove();
            $('body').html('<h2 style="color:#fff">YOU LOSE!</h2><p onclick="location.reload();" style="cursor:pointer;color:#fff">Replay</p>').css({background:'#000'});
        },
        game:function(){
            $('#app').css({
                height:window.innerHeight,
                margin:'0',
                padding:'0',
                background:'#000',
                overflow:'hidden',
                position:'relative'
            })
            
            $('#app').css({
                background: 'url(bg.jpg) repeat-x',
                '-webkit-animation':'slide 1s linear infinite'
            })
            $('#app').append(timer);
            $('#app').append(lvlCounter);  
            $('#app').append(killCounter);    

            // карабль игрока
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
            
            $('#app').append(ship); 
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
                    shipShoot= $(shipShoot).detach().css({left:posShipLeft+24,top:-250});
                    $('#app').append(shipShoot);
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
                    $('#app').append(invader);
                    $(invader).animate({top:window.innerHeight}, speed);
                    setTimeout(function(){ // удаляем элемент захватчика из DOM
                        console.log('del');
                        $(invader).remove();
                    },5000)
                }

                $('body').on('mouseover','.inv',function(){
                    _.loser();
                })
            },3000);
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
            $('#app').append(block);
            $(input).focus();

            $(document).on('input',input,function(){
                var val = $(input).val();
                if(val.length>1){
                     $(confirm).css({display:'block'});
                }else{
                    $(confirm).hide();
                }
            })
            $(confirm).click(function(){
                _.game();
                $(block).remove();
            });
        }
    }

    // объявляем переменные интерфейса
    var timer = document.createElement('div');
    $(timer).text('0').css({padding:'5px'});
    setInterval(function(){
        var val =  $(timer).text();
        $(timer).text(+val+1);
        _.updInfo(); // проверка на новый уровень
    },1000)

    var lvlCounter = document.createElement('div');
    $(lvlCounter).text('Level: '+_.lvl).css({padding:'5px'});

    var killCounter = document.createElement('div');
    $(killCounter).text('Kills: '+_.kills).css({padding:'5px'});

    //_.game(); // запуск игры
    _.welcome();
})
