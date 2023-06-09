$(document).ready(function () {
    rolesPermissions.init()
})

const rolesPermissions = (function () {

    const $moduleCheckBox = $(".module")
    const $permissionCheckBox = $(".permission")


    const init = () => {
        registerEvents()
        handleMainModuleCheck()
    }

    const registerEvents = () => {
        $moduleCheckBox.on('change', handleSpecificModulePermissionCheck)
        $permissionCheckBox.on('change', handleSpecificMainModuleCheck)
        $permissionCheckBox.on('click', handleViewPermissionCheck)
    }

    const handleSpecificModulePermissionCheck = function () {
        var moduleValue = $(this).data('module');
        $(":checkbox[class='" + moduleValue + "-sub permission" + "']").prop("checked", this.checked);
    }

    const handleSpecificMainModuleCheck = function () {
        var moduleValue = $(this).data('module');
        var main = moduleValue.split('-sub')
        var checkBoxes = $(".permission[data-module='" + moduleValue + "']").length;
        var checkedCheckBoxes = $('input[type="checkbox"].' + moduleValue + ':checked').length;
        if (checkBoxes === checkedCheckBoxes) {
            $(".module[data-module='" + main[0] + "']").prop('checked', true);
        } else {
            $(".module[data-module='" + main[0] + "']").prop('checked', false);
        }
    }

    const handleViewPermissionCheck = function () {
        if (this.checked) {
            let route = JSON.parse($(this).val())
            if (Array.isArray(route)) {
                route = route[0]
            }
            const keys = route.url.split('/')
            if (!(route.method === 'get' && keys.length === 1)) {
                if (keys.length > 1) {
                    const selectRoute = {
                        url: '/' + keys[1],
                        method: 'get',
                    }
                    $(":checkbox[value='" + JSON.stringify(selectRoute) + "']").prop("checked", "true")
                }
                // for nested resource route
                // url = '/campaigns/:campaign_id/products'
                if (keys.length >= 5) {
                    const selectRoute = {
                        url: '/' + keys[1] + '/' + keys[2] + '/' + keys[3],
                        method: 'get',
                    }
                    $(":checkbox[value='" + JSON.stringify(selectRoute) + "']").prop("checked", "true")
                }
            }
        }
    }

    function handleMainModuleCheck() {
        let mainPermissions = $(".module");
        for (let i = mainPermissions.length - 1; i >= 0; i--) {
            let permission = mainPermissions[i];
            let moduleName = $(permission).data("module")
            $(".module[data-module='" + moduleName + "']").prop('checked', false);
            let subModuleName = $(permission).data("module") + '-sub'
            var checkBoxes = $(".permission[data-module='" + subModuleName + "']").length;
            var checkedCheckBoxes = $('input[type="checkbox"].' + subModuleName + ':checked').length;
            if (checkBoxes === checkedCheckBoxes) {
                $(".module[data-module='" + moduleName + "']").prop('checked', true);
            } else {
                $(".module[data-module='" + moduleName + "']").prop('checked', false);
            }

        }
    }

    return {
        init,
    }
})()


