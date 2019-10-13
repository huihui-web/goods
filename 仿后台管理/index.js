$(function () {

    //获取商品数据
    var pros = JSON.parse(localStorage.getItem('pros'));

    console.log('pros ==> ', pros);

    //初始化表格数据
    var type = $('.pro-active').data('type');

    //获取当前类型商品数据
    var typeData = pros[type];
    console.log('typeData ==> ', typeData);

    initTypeData(typeData);

    //初始化类型商品数据
    function initTypeData(data) {

        $('.p-t').text($('.pro-active').text());

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

        $('.rm').on('click', function () {

            //获取商品类型
            var type = $('.pro-active').data('type');

            //获取商品id
            var id = $(this).data('id');

            for (var i = 0; i < pros[type].length; i++) {
                if (id == pros[type][i].id) {
                    //删除当前匹配id的商品
                    pros[type].splice(i, 1);

                     //写入本地储存
                    localStorage.setItem('pros', JSON.stringify(pros));

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


    //添加商品
    $('.add>li').on('click', function() {

        //获取商品类型
        var type = $(this).data('type');
        console.log('type ==> ', type)

        //获取当前li文本
        var text = $(this).text();

        $('#pro-type').data('type', type).val(text);

        $('.pro').val('');

        $('#m1').modal();

    })

    $('#save').on('click', function () {

        //保存数据

        //获取商品类型
        var type = $('#pro-type').data('type');

        //创建商品id
        var id = Math.random().toString().slice(2) + Math.floor(Math.random() * 10);

        //商品名称
        var title = $('#pro-name').val();

        //获取价格
        var price = $('#pro-price').val();

        //获取图片链接
        var img = $('#pro-url').val();

        var o = {
            id, //等价于id: id
            img,
            isPlus: false,
            isSubtag: true,
            plusPrice: "0.00",
            price,
            subtag: "券",
            title,
        };

       //在pros数组头部添加一个元素
        pros[type].unshift(o);

         //写入本地存储
        localStorage.setItem('pros', JSON.stringify(pros));

        $('#m1').modal('hide');

    })

    $('#saveedit').on('click', function () {
        //获取商品类型
        var type = $('#edit-pro-type').data('type');

        //获取商品id
        var id = $('#mtitle').data('id');

        //查找修改的商品
        for (var i = 0; i < pros[type].length; i++) {
            if (id == pros[type][i].id) {

                //修改商品数据
                $('.edit-pro').each(function () {
                    var key = $(this).data('title');
                    pros[type][i][key] = $(this).val()
                })

                //写入本地存储
                localStorage.setItem('pros', JSON.stringify(pros));

                break;
            }
        }

        $('#editm1').modal('hide');

    })

    //查看商品
    $('.showdata>li').on({'click': function (){

        //如果当前是激活的
        if ($(this).hasClass('pro-active')) {
            return;
        }

        console.log('aa');

        $(this).addClass('pro-active').siblings().removeClass('pro-active');

        //获取当前商品类型
        var type = $(this).data('type');

        //获取当前类型商品数据
        var typeData = pros[type];

        //移出所有tr
        $('tbody').empty();

        initTypeData(typeData);

    }})




})