function createEc2dashboard(config) {

    var showInstances = function (ec2, services, hcpath) {

        var params = {
            Filters: [
                {
                    Name: 'tag:Name',
                    Values: services
                },
            ],
        };

        ec2.describeInstances(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log(data);

                var $container = $('#ec2dashboard');

                $('.date', $container).fadeOut(100, function () {
                    $(this).text((new Date()).toTimeString()).fadeIn(500);
                });

                $.each(data.Reservations, function (index, reservation) {
                    $.each(reservation.Instances, function (index, instance) {
                        renderInstnaceView(instance, $container, hcpath);
                    });
                });
            }
        });
    }

    var renderInstnaceView = function (instance, $container, hcpath) {
        var instanceId = instance.InstanceId;
        var instanceName = instanceId;
        var instanceIP = instance.PrivateIpAddress

        if (typeof instanceIP == "undefined") {
          return;
        }

        if (typeof instance.Tags[0] != "undefined") {
            instanceName = instance.Tags[0].Value;
            for (var i in instance.Tags) {
                if (instance.Tags[i].Key == 'Name') {
                    instanceName = instance.Tags[i].Value
                }
            }
        }

        if ($('#' + instanceName, $container).length === 0) {
            $('.instances', $container).append(
                '<div id="' + instanceName + '" class="service">' +
                '<div class="service-name">' + instanceName + '</div>' +
                '</div>');
        }

        if ($('#' + instanceId, $container).length === 0) {
            $('#' + instanceName, $container).append('<div id="' + instanceId + '" class="instance"></div>');
        }

        var url = 'http://' + instanceIP + '/' + hcpath;
        checkInstance($('#' + instanceId), url);
    }

    var checkInstance = function checkInstance($elem, url) {
        $elem.removeClass('blink');
        $.ajax({
            url: url,
            timeout: 5000
        }).done(function (data) {

            var revision = '';

            var hcResponse = '';
            if (typeof data == 'object') {
                $.each(data, function (key, value) {
                    if (key == 'revision') {
                        revision = value;
                    }
                    hcResponse += key + ': ' + value + '<br/>';
                });
            } else {
                hcResponse = data;
            }

            if (revision) {
                $elem.css('border-bottom', '12px solid #' + revision.substr(0, 6));
            }

            if ($elem.data('hash') != undefined && $elem.data('hash') != window.btoa(hcResponse)) {
                $elem.addClass('blink');
            }

            $elem.removeClass('fail').addClass('ok').data('hash', window.btoa(hcResponse)).html('<a href="' + url + '" target="_blank">' + hcResponse + '</a>');
        }).fail(function (data) {
            $elem.removeClass('ok').addClass('fail').html('<a href="' + url + '" target="_blank">fail</a>');
        });
    }

    if (!config.accessKeyId) {
        alert('Specify accessKeyId');
    }

    if (!config.region) {
        alert('Specify a region');
    }

    if (!config.services) {
        alert('Specify a list of services');
    }

    if (!config.hcpath) {
        alert('Specify healtcheck path');
    }

    var services = [];
    if (config.services) {
        services = config.services.split(',');
    }

    var secretPassPhrase = config.secretAccessKey;
    if (!secretPassPhrase) {
        secretPassPhrase = prompt('Enter the AWS secretAccessKey', '');
    }

    AWS.config = new AWS.Config({
        accessKeyId: config.accessKeyId,
        secretAccessKey: secretPassPhrase,
        region: config.region
    });

    var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

    showInstances(ec2, services, config.hcpath);

    var recheckInterval = 10000;
    setInterval(function () {
        showInstances(ec2, services, config.hcpath);
    }, recheckInterval);
}
