'use strict';

const Service = require('egg').Service;

const url = require('url');

class AdminService extends Service {
  // 权限验证
  async checkAuth(role_id) {
    const accessList = await this.ctx.model.RoleAccess.find({ role_id });
    const pathname = url.parse(this.ctx.request.url).pathname;
    const accessArry = [];
    const ignoreUrl = [ '/admin/login', '/admin/verify', '/admin/doLogin', '/admin/loginOut' ];
    accessList.forEach(function(item) {
      accessArry.push(item.access_id.toString());
    });
    const accessInfo = await this.ctx.model.Access.find({ url: pathname });
    if (accessInfo.length > 0 && accessArry.indexOf(accessInfo[0]._id.toString()) >= 0 || ignoreUrl.indexOf(pathname) >= 0 || this.ctx.session.userinfo.is_super === 1) {
      return true;
    }
    return false;
  }

  // 获取权限列表
  async getAccessList(role_id) {
    const accessList = await this.ctx.model.Access.aggregate([
      {
        $lookup: {
          from: 'access',
          localField: '_id',
          foreignField: 'module_id',
          as: 'items',
        },
      },
      {
        $match: {
          module_id: '0',
        },
      },
    ]);
    const authInfo = await this.ctx.model.RoleAccess.find({ role_id });
    const access_id_arry = [];
    authInfo.forEach(function(item) {
      access_id_arry.push(item.access_id.toString());
    });
    accessList.forEach(function(item) {
      if (access_id_arry.indexOf(item._id.toString()) >= 0) {
        item.checked = 'true';
      }
      item.items.forEach(function(initem) {
        if (access_id_arry.indexOf(initem._id.toString()) >= 0) {
          initem.checked = 'true';
        }
      });
    });
    return accessList;
  }
}

module.exports = AdminService;
