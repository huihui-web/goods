$(function () {

    //获取本地用户数据
    var users = localStorage.getItem('users');
    users = users ? JSON.parse(users) : [];
    //用户商品类型
    var usertypes = JSON.parse(localStorage.getItem('usertypes'));
    usertypes = usertypes ? usertypes : {};
    //用户商品数据
    var userPros = JSON.parse(localStorage.getItem('user-pros'));
    userPros = userPros ? userPros : {};

    //登录
    $('.login').on('click', function () {
        $('#m1-login').modal();

    });

    $('#save-login').on('click', function () {
        var id = $('#login-id').val();
        var pwd = $('#login-pwd').val();
        if (users.length == 0) {
            return;
        }

        for (var i = 0; i < users.length; i++) {
            //登录成功
            if (id == users[i].id && pwd == users[i].pwd) {
                $('#m1-login').modal('hide');
                console.log('success');

                $('#two').addClass('show');
                //清空输入框内容
                $('#login-id').val('');
                $('#login-pwd').val('');
                //页面显示用户ID
                $('.login-box').html('<div class="userid" style="display:inline-block; color:#fff">用户：<span class="userId" style="color:#e4393c">' + id + '</span><span class="logout">注销</span></span>')
                //注销
                $('.logout').on('click', function () {
                    location.reload();
                })
                //遍历生成当前用户商品类型
                if (usertypes[$('.userId').text()] !== undefined) {

                    //初始化表格数据

                    initTypeData();
                    var type = $('.pro-active').data('type');
                    console.log(type);
                    //获取当前类型商品数据

                    if (userPros[$('.userId').text()] !== undefined) {
                        var typeData = userPros[$('.userId').text()][type];
                        goods(typeData)

                    }

                }



                break;

            } else if (i == users.length - 1) {
                alert('用户或密码错误');
                //清空输入框内容
                $('#login-id').val('');
                $('#login-pwd').val('');
                break;
            }
        }

    })

    //注册
    $('.register').on('click', function () {
        $('#m1-register').modal();

    });
    //保存注册
    $('#save-register').on('click', function () {
        var nickname = $('#register-name').val();
        var id = $('#register-id').val();
        var pwd = $('#register-pwd').val();
        var o = {
            nickname: nickname,
            id: id,
            pwd: pwd
        }
        $('#m1-register').modal('hide');
        var register = true;
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == o.id) {
                register = false;
            }
        }
        if (register == true) {

            //用户信息存入本地内存
            users.push(o);
        } else {
            alert('用户id重复');
            $('#register-name').val('');
            $('#register-id').val('');
            $('#register-pwd').val('');
        }
        localStorage.setItem('users', JSON.stringify(users));
    })
    //点击加号
    $('.add-type').on('click', function () {
        if ($('.userId').text() == '') {
            return;

        }
        $('#addtype').modal();
    })
    //点击加号保存类型
    var add = true; //用于条件判断
    $('#savetype').on('click', function () {

        add = false;
        var title = $('#addtype-pro-type').val();
        var type = Math.random().toString().slice(3) + Math.floor(Math.random() * 10);
        var li = $(` <li class="text-secondary" data-type="${type}">${title}</li>`);
        $('.add,.showdata').append(li);
        $('#addtype').modal('hide');
        var o = {
            title,
            type
        }
        usertypes[$('.userId').text()] = usertypes[$('.userId').text()] === undefined ? [] : usertypes[$('.userId').text()];
        usertypes[$('.userId').text()].push(o);
        //设置本地存储
        localStorage.setItem('usertypes', JSON.stringify(usertypes));
        addgoods();
        $('#addtype-pro-type').val('');
    })

    function addgoods() {
        //点击添加商品
        $('.add>li').on('click', function () {
            if ($('.userId').text() == '') {
                return;

            }

            //获取商品类型
            var type = $(this).data('type');
            // console.log('type ==> ', type)

            //获取当前li文本
            var text = $(this).text();

            $('#pro-type').data('type', type).val(text);

            $('.pro').val('');

            $('#m1').modal();
            //判断是否存在当前用户的商品类型
            userPros[$('.userId').text()] = userPros[$('.userId').text()] ? userPros[$('.userId').text()] : {};


        })

        //添加商品
        $('#save').on('click', function () {
            // console.log(add);
            if (add == false) {
                add = true;
                return;
            }
            //获取商品类型
            var type = $('#pro-type').data('type');

            //创建商品id
            var id = Math.random().toString().slice(2) + Math.floor(Math.random() * 10);

            // console.log(userPros[$('.userId').text()][type]);
            //商品名称
            var title = $('#pro-name').val();

            //获取价格
            var price = $('#pro-price').val();

            //获取图片链接
            var img = $('#pro-url').val();

            var o = {
                id, //等价于id: id
                img,
                price,
                title,
            };
            //判断是否存在该数组
            userPros[$('.userId').text()][type] = userPros[$('.userId').text()][type] === undefined ? [] : userPros[$('.userId').text()][type];

            // 在pros数组头部添加一个元素
            //保存当前用户商品数据
            if (userPros[$('.userId').text()][type].length!=0) {
                // console.log(userPros[$('.userId').text()][type]);

                if (o.title != userPros[$('.userId').text()][type][userPros[$('.userId').text()][type].length - 1].title) {

                    userPros[$('.userId').text()][type].unshift(o);
                }
            } else {
                userPros[$('.userId').text()][type].unshift(o);
            }

            //写入本地存储
            localStorage.setItem('user-pros', JSON.stringify(userPros));
            //如果添加的商品属于当前商品数据表激活状态
            if (type == $('.pro-active').data('type')) {
                var typeData = userPros[$('.userId').text()][type];
                goods(typeData);
            }
            $('#m1').modal('hide');
        })
        showdataLook();
    }

    //初始化商品
    function goods(data) {
        $('tbody>tr').remove();
        $.each(data, function (i, item) {

            var $tr = $(`<tr><td>${i + 1}</td>
               <td>
                   <div class="pro-img">
                       <img class="d-block w-100" src="${item.img}" alt="">
                   </div>
               </td>
               <td>
                   <div class="pro-title">${item.title}</div>
               </td>
               <td>
                   <div class="pro-price">${item.price}</div>
               </td>
               <td>
                       <button type="button" class="btn btn-warning btn-sm eidt" data-id="${item.id}">编辑</button>
                       <button type="button" class="btn btn-danger btn-sm rm" data-id="${item.id}">删除</button>
               </td></tr>`);

            $('tbody').append($tr);
        })
        //编辑商品


        $('.eidt').on('click', function () {
            console.log('s');

            //设置商品配型
            $('#edit-pro-type').data('type', $('.pro-active').data('type')).val($('.pro-active').text());

            //获取编辑商品的数据
            var $tr = $(this).parents('tr');

            var title = $tr.find('.pro-title').text();

            var price = $tr.find('.pro-price').text();

            var img = $tr.find('img').attr('src');

            $('[data-title="title"]').val(title);
            $('[data-title="price"]').val(price);
            $('[data-title="img"]').val(img);

            $('#mtitle').data('id', $(this).data('id'));

            $('#editm1').modal();
        })
        //保存编辑
        $('#saveedit').on('click', function () {
            //获取商品类型
            var type = $('#edit-pro-type').data('type');

            //获取商品id
            var id = $('#mtitle').data('id');

            //查找修改的商品
            for (var i = 0; i < userPros[$('.userId').text()][type].length; i++) {
                if (id == userPros[$('.userId').text()][type][i].id) {

                    //修改商品数据
                    $('.edit-pro').each(function () {
                        var key = $(this).data('title');
                        userPros[$('.userId').text()][type][i][key] = $(this).val()
                    })

                    //写入本地存储
                    localStorage.setItem('user-pros', JSON.stringify(userPros));

                    break;
                }
            }

            $('#editm1').modal('hide');
            var typeData = userPros[$('.userId').text()][type];
            goods(typeData);
        })
        //移出商品
        $('.rm').on('click', function () {

            //获取商品类型
            var type = $('.pro-active').data('type');

            //获取商品id
            var id = $(this).data('id');

            for (var i = 0; i < userPros[$('.userId').text()][type].length; i++) {
                if (id == userPros[$('.userId').text()][type][i].id) {
                    //删除当前匹配id的商品
                    userPros[$('.userId').text()][type].splice(i, 1);

                    //写入本地储存
                    localStorage.setItem('user-pros', JSON.stringify(userPros));

                    //删除页面的tr
                    $(this).parents('tr').remove();

                    //修改序号
                    $('tbody>tr').each(function (k) {
                        $(this).find('td').eq(0).text(k + 1);
                    })

                    break;
                }
            }

        })
    }
    //查看商品
    function showdataLook() {
        $('.showdata>li').on({
            'click': function () {

                //如果当前是激活的
                if ($(this).hasClass('pro-active')) {
                    return;
                }

                console.log('aa');

                $(this).addClass('pro-active').siblings().removeClass('pro-active');

                //获取当前商品类型
                var type = $(this).data('type');

                if (userPros[$('.userId').text()] !== undefined) {
                    //获取当前类型商品数据

                    var typeData = userPros[$('.userId').text()][type];

                    //移出所有tr
                    $('tbody').empty();

                    goods(typeData);
                    $('.p-t').text($('.pro-active').text());
                }

            }
        })
    }
    //初始化类型商品数据
    function initTypeData() {
        //初始化商品类型
        for (var i = 0; i < usertypes[$('.userId').text()].length; i++) {
            var li = $(` <li class="text-secondary" data-type="${usertypes[$('.userId').text()][i].type}">${usertypes[$('.userId').text()][i].title}</li>`);
            $('.add,.showdata').append(li);
        }

        addgoods();

        $('.showdata>li:first-child').addClass('pro-active');
        $('.p-t').text($('.pro-active').text());

        //查看商品
        showdataLook()

    }

})