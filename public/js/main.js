                                    new Vue({
                                        el: '#app',
                                        data: function() {
                                            return {
                                                visible: false,
                                                input: '',
                                            }
                                        },
                                        methods: {
                                            parse() {
                                                var url = document.getElementById("url")
                                                    .value;
                                                if (url == "") {
                                                    const h = this.$createElement;

                                                    this.$notify({
                                                        title: '温馨提示',
                                                        message: h('i', {
                                                            style: 'color: teal'
                                                        }, '链接不能为空，请您先提供B站视频地址或BVID后重新尝试')
                                                    });
                                                } else {

                                                    function bvids(find) {
                                                        var str = url;
                                                        str = str.replace(/\//g, '');
                                                        str = str.match(find)[1];
                                                        return str;
                                                    }

                                                    function instr(strs, findse) {
                                                        if (strs.indexOf(findse) != -1) {
                                                            return 1;
                                                        } else {
                                                            return 0;
                                                        }
                                                    }
                                                    let finds = "";
                                                    if (instr(url, "?ts") == 1) {
                                                        finds = /video(\S*)\?ts/;
                                                    } else if (instr(url, "list") == 1) {
                                                        finds = /bvid=(\S*)&oid/;
                                                    } else if (instr(url, "?-")) {
                                                        finds = /video(\S*)\?-/;
                                                    } else if (instr(url, "/video/") == 0) {
                                                        finds = /(\S*)/;
                                                    } else if (instr(url, "?q") == 1) {
                                                        finds = /video(\S*)\?q/;
                                                    } else {
                                                        finds = /video(\S*)/;
                                                    }
                                                    var ifs = "false";
                                                    $(document)
                                                        .ready(function() {
                                                        var url = '/api?bvid=' + bvids(finds);
                                                        $.ajax({
                                                            url: url,
                                                            method: 'POST',
                                                            success: function(data) {
                                                                // 将获取到的源代码设置到文本区域
                                                                if (data.code == "-1") {
                                                                    var $ = mdui.$;
                                                                    var inst = new mdui.Dialog('#dialog');
                                                                    document.getElementById("content")
                                                                        .innerText = data.msg;
                                                                    inst.open();
                                                                    // event
                                                                    $('#dialog').on('open.mdui.dialog', function () {
                                                                      console.log('open');
                                                                    });
                                                                    
                                                                    $('#dialog').on('opened.mdui.dialog', function () {
                                                                      console.log('opened');
                                                                    });
                                                                    
                                                                    $('#dialog').on('close.mdui.dialog', function () {
                                                                      console.log('close');
                                                                    });
                                                                    
                                                                    $('#dialog').on('closed.mdui.dialog', function () {
                                                                      console.log('closed');
                                                                    });
                                                                    
                                                                    $('#dialog').on('cancel.mdui.dialog', function () {
                                                                      console.log('cancel');
                                                                    });
                                                                    
                                                                    $('#dialog').on('confirm.mdui.dialog', function () {
                                                                      console.log('confirm');
                                                                    });
                                                                    return;
                                                                }
                                                                data.data.forEach(item => {
                                                                    var a = document.getElementById("videos");
                                                                    if (a !== null) {
                                                                        var b = document.getElementById("sources");
                                                                        a.remove();
                                                                        b.remove();
                                                                    }
                                                                    var video = document.createElement("video");
                                                                    video.ClassName = "videos";
                                                                    video.id = "videos";
                                                                    video.controls = true;
                                                                    var box = document.getElementById("video");
                                                                    var source = document.createElement("source");
                                                                    source.src = item.video_url;
                                                                    source.type = "video/mp4";
                                                                    source.ClassName = "sources";
                                                                    source.id = "sources";
                                                                    video.appendChild(source);
                                                                    box.appendChild(video);
                                                                    document.getElementById("title")
                                                                        .innerText = data.title;
                                                                    document.getElementById("Introduction")
                                                                        .innerText = data.desc;
                                                                    document.getElementById("fm")
                                                                        .href = data.imgurl;
                                                                    document.getElementById("urls")
                                                                        .href = item.video_url;
                                                                    document.getElementById("fm")
                                                                        .innerText = data.imgurl;
                                                                    document.getElementById("urls")
                                                                        .innerText = item.video_url;
                                                                });
                                                            },
                                                            error: function(error) {
                                                                //获取错误
                                                            }
                                                        });
                                                    });
                                                }
                                            },
                                        }
                                    });
