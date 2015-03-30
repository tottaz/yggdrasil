<div class="container">
    <table class='table table-striped'>
            <thead>
            <tr>
                    <th class="cell1">Name</th>
                    <th class="cell3">Email</th>
                    <th class="cell5">Group</th>
                    <th class="cell5">Login Type</th>
                    <th class="cell5">Last Login</th>                   
                    <th class="cell5">Status</th>                    
            </tr>
            </thead>
            <tbody>
               
            <?php foreach ($users as $user): ?>
                    <tr>
                            <td><?php echo anchor('admin/users/edit/'.$user['id'], $user['first_name'].' '.$user['last_name']) ?></td>
                            <td><?php echo mailto($user['email']) ?></td>

                            <?php if (is_sadmin()): ?>
                            <td><?php echo anchor('admin/groups/edit/'.$user['group_id'], $user['group_description']) ?></td>
                            <?php else: ?>
                            <td><?php echo $user['group_description'] ?></td>
                            <?php endif ?>
                            <td>
                                    <?php echo ($user['via_ldap']); ?>
                            </td>
                            <td>
                                    <?php echo date('Y/m/d', $user['last_login']); ?>
                            </td>                                                                                    
                            <td>
                                    <?php echo ($user['active']) ? anchor("admin/users/deactivate/".$user['id'], 'Active') : anchor("admin/users/activate/". $user['id'], 'Inactive'); ?>
                            </td>
                    </tr>
            <?php endforeach;?>
            </tbody>
    </table>
</div><!-- /table-area -->